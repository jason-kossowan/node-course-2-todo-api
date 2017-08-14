const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

var userOneId = new ObjectID(),
    userTwoId = new ObjectID();

const testUsers = [
    {
        _id: userOneId,
        email: 'testUser1@somewhere.com',
        password: 'testUser1Password',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({
                    _id: userOneId,
                    access: 'auth'
                }, 'abc123').toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'testUser2@somewhere.com',
        password: 'testUser2Password'
    }
];

const testTodos = [
    {
        _id: new ObjectID(),
        text: 'Test todo 1'
    },
    {
        _id: new ObjectID(),
        text: 'Test todo 2',
        completed: true,
        completedAt: 333
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(testTodos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(testUsers[0]).save(),
            userTwo = new User(testUsers[1]).save();
        
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = { testTodos, populateTodos, testUsers, populateUsers };