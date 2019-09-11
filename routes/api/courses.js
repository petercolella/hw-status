const router = require('express').Router();
const coursesController = require('../../controllers/coursesController');

router
  .route('/')
  .get(coursesController.findAll)
  .post(coursesController.create);

router
  .route('/:id')
  .get(coursesController.findById)
  .put(coursesController.update)
  .delete(coursesController.remove);

module.exports = router;
