const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// BCRYPT

var password = '123abc';

// bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$yH7i4f9.6qX2xb3tJJwWdOTmw3SvDsspJHf3mJ28FVKe0BoXJoLlC';

bcrypt.compare(password, hashedPassword, (error, result) => {
    console.log(result);
});

// JWT example

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);


// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // man in the middle
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();


// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash == token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed - do not trust it');
// }