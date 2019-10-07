const router = require('express').Router();
const assignmentsController = require('../../controllers/assignmentsController');

router
  .route('/')
  .get(assignmentsController.findAll)
  .post(assignmentsController.create);

router.route('/populate').post(assignmentsController.populate);
router.route('/delete').post(assignmentsController.delete);

router
  .route('/:id')
  .get(assignmentsController.findById)
  .put(assignmentsController.update)
  .delete(assignmentsController.remove);

module.exports = router;
