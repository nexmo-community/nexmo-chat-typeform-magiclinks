const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  display_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  member_id: {
    type: String,
    required: true
  }
});

module.exports = UserSchema;