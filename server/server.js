require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;
const db = process.env.MONGODB_URI;

app.use(bodyParser.json());

app.post('/todos', authenticate, (request, response) => {
    var todo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    })

    todo.save().then((document) => {
        response.send(document);
    }, (error) => {
        response.status(400).send(error);
    });
});

app.get('/todos', authenticate, (request, response) => {
    Todo.find({
        _creator: request.user._id
    }).then((todos) => {
        response.send({ todos });
    }, (error) => {
        response.status(400).send(error);
    });
});

app.get('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    };

    Todo.findOne({
        _id: id,
        _creator: request.user._id
    }).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, async (request, response) => {
    const id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    };

    try {
        const todo = await Todo.findOneAndRemove({
            _id: id,
            _creator: request.user._id
        });

        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    }
    catch (error) {
        response.status(400).send();
    }


    // Todo.findOneAndRemove({
    //     _id: id,
    //     _creator: request.user._id
    // }).then((todo) => {
    //     if (!todo) {
    //         return response.status(404).send();
    //     }

    //     response.send({ todo });
    // }).catch((error) => {
    //     response.status(400).send();
    // });
});

app.patch('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    };

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: request.user._id
    }, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return response.status(404).send();
        }

        response.send({ todo });
    }).catch((error) => {
        response.status(400).send();
    });
});

app.post('/users', async (request, response) => {
    try {
        const body = _.pick(request.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        response.header('x-auth', token).send(user);
    } catch (error) {
        response.status(400).send();
    }
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/users/login', async (request, response) => {

    try {
        const body = _.pick(request.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        let token = await user.generateAuthToken();
        response.header('x-auth', token).send(user);
    } catch (error) {
        response.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (request, response) => {
    try {
        await request.user.removeToken(request.token);
        response.status(200).send();
    } catch (e) {
        response.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
    console.log(`Database connected at ${db}`);
});

module.exports = { app };