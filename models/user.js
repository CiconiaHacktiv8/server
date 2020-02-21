const { hashPassword } = require('../helpers/bcrypt')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
const UserSchema = new Schema({
    
});

UserSchema.pre('save', function(next) {
    this.password = hashPassword(this.password)
    next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User