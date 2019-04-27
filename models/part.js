var mongoose = require('mongoose');

var PartSchema = new mongoose.Schema({
  content: {
    type: String
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
  
},{ usePushEach: true });

var Part = mongoose.model('Part', PartSchema);
module.exports = Part;