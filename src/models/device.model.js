const mongoose = require('mongoose');
const deviceSchema = new mongoose.Schema({
  name: { type: String },
  value: { type: Number },
  stationType: { type: Number }
});
module.exports = mongoose.model('StationCollection', deviceSchema);
