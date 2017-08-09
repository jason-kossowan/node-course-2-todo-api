const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// var id = '598b78cb5daf0943148a888111';

// if (!ObjectID.isValid(id)) {
//     console.log('Invalid Object ID', id);
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// }).catch((error) => { console.log(error); });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// }).catch((error) => { console.log(error); });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
    
//     console.log('Todo by Id', todo);
// }).catch((error) => { console.log(error); });

User.findById('598b64fb4116f2311ccb0e39').then((user) => {
    if (!user) {
        return console.log('Could not find user');
    }

    console.log(JSON.stringify(user, undefined, 4));
}).catch((error) => { console.log(error); });