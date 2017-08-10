const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// deletes all
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// delete by query
// Todo.findOneAndRemove({ text: 'Something to do' }).then((result) => {
//     console.log(result);
// });

// delete by ID
Todo.findByIdAndRemove('598cc63ecdb239022186fdff').then((result) => {
    console.log(result);
});