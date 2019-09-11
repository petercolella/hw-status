const router = require('express').Router();
const assignmentRoutes = require('./assignments');
const courseRoutes = require('./courses');
const userRoutes = require('./users');

router.use('/assignments', assignmentRoutes);
router.use('/courses', courseRoutes);
router.use('/users', userRoutes);

module.exports = router;
