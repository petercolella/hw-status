const db = require('../models');
const axios = require('axios');

function axiosConfig(response, courseId) {
  return {
    url: 'https://www.bootcampspot.com/api/instructor/v1/grades',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authToken: response.data.authenticationInfo.authToken
    },
    data: { courseId: parseInt(courseId) }
  };
}

function createAssignmentIdArray(assignments) {
  return new Promise((resolve, reject) => {
    const idArr = [];
    assignments.forEach(doc => idArr.push(doc._id));
    resolve(idArr);
    reject('Something went wrong while creating the assignment ID array.');
  });
}

function findCourse(courseId) {
  return db.Course.findOne({ courseId: parseInt(courseId) });
}

function newCourse(courseId, idArr) {
  return db.Course.create({
    courseId: parseInt(courseId),
    assignments: idArr
  });
}

function deleteCourseAssignments(docs) {
  return new Promise((resolve, reject) => {
    const promises = [];
    for (let assignmentId of docs.assignments) {
      promises.push(db.Assignment.findByIdAndDelete(assignmentId));
    }
    Promise.all(promises)
      .then(arrayOfDeletedAssignments => resolve(arrayOfDeletedAssignments))
      .catch(err => reject(err));
  });
}

function updateCourse(docs, idArr) {
  return db.Course.findOneAndUpdate(
    { _id: docs._id },
    { $set: { assignments: idArr } },
    { new: true }
  );
}

function handleError(res, err) {
  console.error(err.message);
  return res.status(err.response.status).json(err);
}

module.exports = {
  populate: function(req, res) {
    const { email, password, courseId } = req.body;
    const login = { email, password };
    axios
      .post('https://www.bootcampspot.com/api/instructor/v1/login', login)
      .then(response => {
        axios(axiosConfig(response, courseId))
          .then(response => {
            db.Assignment.insertMany(response.data)
              .then(assignments => createAssignmentIdArray(assignments))
              .then(idArr => {
                findCourse(courseId)
                  .then(docs => {
                    if (!docs) {
                      newCourse(courseId, idArr)
                        .then(newCourse => {
                          console.log('newCourse:', newCourse);
                          res.json(newCourse);
                        })
                        .catch(err => res.status(422).json(err));
                    } else {
                      deleteCourseAssignments(docs)
                        .then(() => {
                          updateCourse(docs, idArr)
                            .then(updatedCourse => {
                              console.log('updatedCourse:', updatedCourse);
                              res.json(updatedCourse);
                            })
                            .catch(err => res.status(422).json(err));
                        })
                        .catch(err => handleError(res, err));
                    }
                  })
                  .catch(err => handleError(res, err));
              })
              .catch(err => handleError(res, err));
          })
          .catch(err => handleError(res, err));
      })
      .catch(err => handleError(res, err));
  },
  findAll: function(req, res) {
    db.Assignment.find(req.query)
      .then(dbModel => {
        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Assignment.findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Assignment.create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Assignment.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Assignment.findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};
