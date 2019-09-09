const router = require('express').Router();
const userRoutes = require('./users');
const assignmentRoutes = require('./assignments');

router.use('/users', userRoutes);
router.use('/assignments', assignmentRoutes);

module.exports = router;
