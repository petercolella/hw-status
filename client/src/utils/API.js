import axios from 'axios';

export default {
  getCourse: function(id) {
    return axios.get('/api/courses/' + id);
  },
  updateCourse: function(id, courseData) {
    return axios.put('/api/courses/' + id, courseData);
  },
  populateAssignments: function(reqBody) {
    return axios.post('/api/assignments/populate', reqBody);
  },
  deleteAssignments: function(reqBody) {
    return axios.post('/api/assignments/delete', reqBody);
  },
  getAssignments: function() {
    return axios.get('/api/assignments');
  },
  getAssignment: function(id) {
    return axios.get('/api/assignments/' + id);
  },
  deleteAssignment: function(id) {
    return axios.delete('/api/assignments/' + id);
  },
  saveAssignment: function(assignmentData) {
    return axios.post('/api/assignments', assignmentData);
  },
  updateAssignment: function(id, assignmentData) {
    return axios.put('/api/assignments/' + id, assignmentData);
  }
};
