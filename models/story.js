var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  }
});

var Story = mongoose.model('Story', UserSchema);
module.exports = Story;