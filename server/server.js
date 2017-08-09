var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/Todo');
var { User } = require('./models/User');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    })

    todo.save().then((document) => {
        response.send(document);
    }, (error) => {
        response.status(400).send(error);
    })
});

app.listen(3000, () => {
    console.log('App started on port 3000');
});