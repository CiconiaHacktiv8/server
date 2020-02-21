const { hashPassword } = require('../helpers/bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Invalid email format',
    ],
    validate: {
      validator: function(email) {
        return mongoose.models.User.findOne({ email }).then(user => {
          if (user) return false
          return true
        })
      },
      msg: 'Email already registered',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Min length of password is 6 characters'],
  },
  point: {
    type: String,
    default: 0,
  },
})

UserSchema.post('validate', function(user) {
  user.password = hashPassword(user.password)
})

const User = mongoose.model('User', UserSchema)
module.exports = User
