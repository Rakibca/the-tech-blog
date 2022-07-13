const router = require('express').Router();
const {
  Blog,
  User,
  Comment
} = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');


// GET all comments
router.get('/', async (req, res) => {
  try {
    const commentData = await Comment.findAll({})
    res.json(commentData))
} catch (err) {
  res.status(500).json(err);
}
});


// CREATE new comments
router.post('/', withAuth, async (req, res) => {
  try {
    // check session
    if (req.session) {
      const commentData = await Comment.create({
        comment_description: req.body.comment_description,
        blog_id: req.body.blog_id,
        // use the id from the session
        user_id: req.session.user_id,
      })
      res.json(commentData))
  } catch (err) {
    res.status(500).json(err);
  }
}
});


// DELETE COMMENT
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!commentData) {
      res.status(404).json({
        message: 'There is no comment with this id!'
      });
      return;
    }
    res.json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
