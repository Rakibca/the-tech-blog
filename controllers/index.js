const router = require('express').Router();

const homeRoutes = require('./homeRoutes.js');
const dashboardRoutes = require('./dashboardRoutes.js');
const apiRoutes = require('./api');

router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', apiRoutes);

router.use((req, res) => {
  res.status(404).end();
});


module.exports = router;
