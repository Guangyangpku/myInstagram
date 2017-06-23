var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  imagePath: {type: String, required: true},
  username: {type: String, required: true},
  description: {type: String, required: true},
  thumbups: [ String ],
  comments: [ {
            username: String,
            description: String
        }]
});

module.exports = mongoose.model('Product', schema);
