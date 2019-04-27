var mongoose = require('mongoose');

var StorySchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Part' }]
},{ usePushEach: true });

var Story = mongoose.model('Story', StorySchema);
module.exports = Story;