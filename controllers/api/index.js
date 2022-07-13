const router = require('express').Router();

const blogRoutes = require('./blogRoutes.js');
const commentRoutes = require('./commentRoutes.js');
const userRoutes = require('./userRoutes.js');

router.use('/blogs', blogRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);


module.exports = router;
