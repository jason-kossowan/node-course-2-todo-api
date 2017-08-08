const { MongoClient, ObjectID } = require('mongodb');

let mongoEndpoint = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(mongoEndpoint, (error, db) => {
    if (error) {
        return console.log(`Unable to connect to MongoDB server at ${mongoEndpoint}.`);
    }

    console.log(`Connected to MongoDB at ${mongoEndpoint}.`);

    // db.collection('Todos').insertOne(
    //     {
    //         text: 'Something to do',
    //         completed: false
    //     },
    //     (error, result) => {
    //         if (error) {
    //             return console.log(`Unable to insert Todo`, error);
    //         }

    //         console.log(JSON.stringify(result.ops, undefined, 4));
    //     });
    
    // insert new doc into Users collection (name, age, location)
    // db.collection('Users').insertOne({
    //     name: 'Jason',
    //     age: 41,
    //     location: 'Edmonton'

    // }, (error, result) => {
    //     if (error) {
    //         return console.log(`Unable to insert User`, error);
    //     }

    //     console.log(result.ops[0]._id.getTimestamp());
    // })
    
    db.close();
});