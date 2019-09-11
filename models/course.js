const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseId: Number,
  assignments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Assignment'
    }
  ],
  nonStudents: Array
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
