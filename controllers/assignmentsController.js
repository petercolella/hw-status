const db = require('../models');
const axios = require('axios');

module.exports = {
  populate: function(req, res) {
    const { email, password, courseId } = req.body;
    const login = { email, password };
    axios
      .post('https://www.bootcampspot.com/api/instructor/v1/login', login)
      .then(response => {
        const settings = {
          url: 'https://www.bootcampspot.com/api/instructor/v1/grades',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authToken: response.data.authenticationInfo.authToken
          },
          data: { courseId: parseInt(courseId) }
        };
        axios(settings)
          .then(response => {
            db.Assignment.insertMany(response.data, function(err, assignments) {
              if (err) return console.log('Insert Error:', err);
              const idArr = [];
              assignments.forEach(doc => idArr.push(doc._id));
              db.Course.findOne(
                { courseId: parseInt(courseId) },
                (err, docs) => {
                  if (err) console.error(err);
                  if (!docs) {
                    db.Course.create(
                      { courseId: parseInt(courseId), assignments: idArr },
                      { new: true },
                      (err, dbModel1) => {
                        if (err) console.error(err);
                        console.log('dbModel1', dbModel1);
                        res.json(dbModel1);
                      }
                    );
                  } else {
                    docs.assignments.forEach(assignmentId => {
                      db.Assignment.findByIdAndDelete(assignmentId, err => {
                        if (err) console.error(err);
                      });
                    });
                    db.Course.findOneAndUpdate(
                      { courseId: parseInt(courseId) },
                      { $set: { assignments: idArr } },
                      { new: true },
                      (err, updatedCourse2) => {
                        if (err) console.error(err);
                        console.log('updatedCourse2', updatedCourse2);
                        res.json(updatedCourse2);
                      }
                    );
                  }
                }
              );
            });
          })
          .catch(err => console.log(err.message));
      });
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
