const { MongoClient, ObjectID } = require('mongodb');

let mongoEndpoint = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(mongoEndpoint, (error, db) => {
    if (error) {
        return console.log(`Unable to connect to MongoDB server at ${mongoEndpoint}.`);
    }

    console.log(`Connected to MongoDB at ${mongoEndpoint}.`);
    
    // deleteMany
    // db.collection('Todos').deleteMany({ text: 'Eat lunch' }).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ completed: false }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').deleteMany({ name: 'Jason' }).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('598a288840c3467eb2826347')
    }).then((result) => {
        console.log(result);
    });

    // db.close();
});