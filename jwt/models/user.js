const mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    eamil: String,
    address: String,
    password: String,
})
module.exports = mongoose.model('users', userSchema)