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

app.delete('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;

    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    };

    Todo.findOneAndRemove({
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

app.post('/users', (request, response) => {
    let body = _.pick(request.body, ['email', 'password']);

    // missing property validation not required since the validation will catch missing properties    

    var user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            response.header('x-auth', token).send(user);
        }, (error) => {
            response.status(400).send();
        });
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/users/login', (request, response) => {

    let body = _.pick(request.body, ['email', 'password']);

    var user = User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            response.header('x-auth', token).send(user);
        });
    }).catch((error) => {
        response.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (request, response) => {
    request.user.removeToken(request.token).then(() => {
        response.status(200).send();
    },(error) => {
        response.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`App started on port ${port}`);
    console.log(`Database connected at ${db}`);
});

module.exports = { app };