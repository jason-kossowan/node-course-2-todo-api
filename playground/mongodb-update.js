const { MongoClient, ObjectID } = require('mongodb');

let mongoEndpoint = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(mongoEndpoint, (error, db) => {
    if (error) {
        return console.log(`Unable to connect to MongoDB server at ${mongoEndpoint}.`);
    }

    console.log(`Connected to MongoDB at ${mongoEndpoint}.`);

    // db.collection('Todos').findOneAndUpdate(
    //     { _id: new ObjectID("598b44268038fa9f8fffc165") },
    //     {
    //         $set: { completed: true }
    //     },
    //     { returnOriginal: false }
    // ).then((result) => {
    //         console.log(result);
    //     });

    // db.close();

    db.collection('Users').findOneAndUpdate(
        { _id: new ObjectID("598a26e9a7de037e7458fa45") },
        {
            $inc: { age: 1 }
        },
        { returnOriginal: false }
    ).then((result) => {
        console.log(result);
    })
});