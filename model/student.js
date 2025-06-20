const mongoose = require('mongoose');
const mySchema = new mongoose.Schema({


    name: { type: String, required: true },
    email: { type: String, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true }

})

const mymodel = mongoose.model('user', mySchema, 'student');

module.exports = mymodel;
console.log("success")
