const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  assignmentTitle: String,
  studentName: String,
  submitted: Boolean,
  grade: String
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
