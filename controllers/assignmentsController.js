const db = require('../models');
const axios = require('axios');

module.exports = {
  populate: function(req, res) {
    const { email, password, courseId } = req.body;
    const login = { email, password };
    axios
      .post('https://www.bootcampspot.com/api/instructor/v1/login', login)
      .then(response => console.log(response));
    res.end();
  },
  findAll: function(req, res) {
    db.Assignment.find(req.query)
      .then(dbModel => {
        //   console.log(dbModel);
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
