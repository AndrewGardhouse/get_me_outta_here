var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phonenumber: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

mongoose.model('User', User);
mongoose.connect("mongodb://localhost/gmoh");