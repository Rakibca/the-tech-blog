const router = require('express').Router();
const {
  Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', withAuth, async (req, res) => {
  try {
    const commentData = await Comment.findAll({
      include: [User],
    });
    const comments = commentData.map((comment) => comment.get({
      plain: true
    }));

    console.log(comments);

    res.render('post', {
      comments,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/', withAuth, async (req, res) => {
  //const body = req.body;
  if (req.session) {
    //console.log('good1');
    console.log(req.body);
    try {
      //console.log('good2');
      const newComment = await Comment.create({
        commentText: req.body.comment_body,
        post_id: req.body.post_id,
      })
      res.status(200).json(newComment);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const commentData = Comment.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!commentData) {
      res.status(404).json({
        message: 'No comment found with this id!'
      });
      return;
    }
    res.json(commentData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
