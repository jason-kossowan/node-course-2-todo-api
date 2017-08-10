const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

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

describe('GET /todos:id', () => {

    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${testTodos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(testTodos[0].text);
            })
            .end(done);
    });

    it('should throw a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should throw a 404 with invalid ids', (done) => {
        request(app)
            .get(`/todos/foobar`)
            .expect(404)
            .end(done);
    });

});



describe('PATCH /todos:id', () => {

    it('should update the todo', (done) => {

        let id = testTodos[0]._id.toHexString(),
            expectedPatchText = 'Test todo PATCH text';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: expectedPatchText,
                completed: true
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(expectedPatchText);
                expect(response.body.todo.completed).toBe(true);
                expect(response.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });


    it('should clear completedAt when todo is not completed', (done) => {

        let id = testTodos[1]._id.toHexString(),
            expectedPatchText = 'Test todo PATCH text';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: expectedPatchText,
                completed: false
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(expectedPatchText);
                expect(response.body.todo.completed).toBe(false);
                expect(response.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });

    it('should throw a 404 if todo not found', (done) => {
        request(app)
            .patch(`/todos/${new ObjectID()}`)
            .send({ text: 'anything' })
            .expect(404)
            .end(done);
    });

    it('should throw a 404 with invalid ids', (done) => {
        request(app)
            .patch(`/todos/foobar`)
            .send({ text: 'anything' })
            .expect(404)
            .end(done);
    });

});