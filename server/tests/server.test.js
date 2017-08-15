const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { testTodos, populateTodos, testUsers, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /users/me', () => {
    
    it('should return user if authenticated', (done) => {

        var testUser = testUsers[0]
        passedInToken = testUser.tokens[0].token,
            expectedTokenId = testUser._id.toHexString();

        request(app)
            .get('/users/me')
            .set('x-auth', passedInToken)
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(expectedTokenId);
                expect(response.body.email).toBe(testUser.email);
            })
            .end(done);

    });

    it('should return a 401 if not authenticated', (done) => {

        request(app)
            .get('/users/me')
            .set('x-auth', 'ihackedthispassword')
            .expect(401)
            .expect((response) => {
                expect(response.body).toEqual({})
            })
            .end(done);

    });

});

describe('POST /users', () => {

    it('should create a user', (done) => {

        let email = 'example@example.com',
            password = '123mnb!';
        
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toExist()
            })
            .expect((response) => {
                expect(response.body._id).toExist();
                expect(response.body.email).toBe(email);
            })
            .end((error) => {
                if (error) {
                    return done(error);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((error) => { done(error) });;
            });

    });

    it('should return validation errors if request invalid', (done) => {

        var email = 'blah',
            password = 'short';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        let email = testUsers[0].email,
            password = testUsers[0].email;

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });

});

describe('POST /users/login', () => {
    
    it('should login user and return auth token', (done) => {
        let user = testUsers[1],
            { email, password } = user;

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toExist();
            })
            .end(
            (error, response) => {
                if (error) {
                    return done(error);
                }

                User.findById(user._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: response.headers['x-auth']
                    });
                    done();
                }).catch((error) => { done(error) });
            });
    });

    it('should return invalid login', (done) => {
        let user = testUsers[1],
            email = user.email,
            password = 'iamhaxx0r';

        request(app)
            .post('/users/login')
            .send({ email, password })
            .expect(400)
            .expect((response) => {
                expect(response.headers['x-auth']).toNotExist();
            })
            .end(
            (error, response) => {
                if (error) {
                    return done(error);
                }

                User.findById(user._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((error) => { done(error) });
            });
    });
});

describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {
        let user = testUsers[0],
            token = user.tokens[0].token;

        request(app)
        .delete('/users/me/token')
        .set('x-auth', token)
        .expect(200)
        .end((error, response) => {
            if(error) {
                return done(error);
            }

            User.findById(user._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((error) => {done(error)});
        });

    });
    
});