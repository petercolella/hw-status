const router = require('express').Router();
const assignmentRoutes = require('./assignments');
const courseRoutes = require('./courses');

router.use('/assignments', assignmentRoutes);
router.use('/courses', courseRoutes);

module.exports = router;
