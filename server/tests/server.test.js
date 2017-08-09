const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const testTodos = [
    {
        text: 'Test todo 1'
    },
    {
        text: 'Test todo 2'
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(testTodos);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should create a new todo', (done) => {
        var expectedText = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text: expectedText })
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(expectedText)
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find({ text: expectedText }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos.text = expectedText);
                    done();
                }).catch((error) => {
                    done(error);
                })
            });
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    });
});