const { MongoClient, ObjectID } = require('mongodb');

let mongoEndpoint = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(mongoEndpoint, (error, db) => {
    if (error) {
        return console.log(`Unable to connect to MongoDB server at ${mongoEndpoint}.`);
    }

    console.log(`Connected to MongoDB at ${mongoEndpoint}.`);

    // db.collection('Todos').find({
    //     _id: new ObjectID('598a26753f38c97b5ce2f18c')
    // }).toArray().then((documents) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(documents, undefined, 4));
    // }, (error) => {
    //     console.log('Unable to fetch todos', error);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (error) => {
    //     console.log('Unable to fetch todos', error);
    // });
    
    db.collection('Users').find({ name: 'Jason' }).toArray().then((documents) => {
        console.log('All users that are Jason');
        console.log(JSON.stringify(documents, undefined, 4));
    }, (error) => {
        console.log(error);
    });
    
    // db.close();
});