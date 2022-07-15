const router = require('express').Router();
const {
  Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


// router.get('/', withAuth, async (req, res) => {
//   try {
//     const commentData = await Comment.findAll({
//       include: [User],
//     });
//     // serialize the data
//     const comments = commentData.map((comment) => comment.get({
//       plain: true
//     }));
//
//     //console.log(comments);
//
//     res.render('post', {
//       comments,
//       logged_in: req.session.logged_in
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


// router.post('/', withAuth, async (req, res) => {
//   try {
//     const newComment = await Comment.create({
//       ...req.body,
//       user_id: req.session.user_id,
//     });
//
//     res.status(200).json(newComment);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// });


CREATE new comments
router.post('/', withAuth, (req, res) => {
    // check session
    if (req.session) {
    Comment.create({
        description: req.body.description,
        post_id: req.body.post_id,
        // use the id from the session
        user_id: req.session.user_id,
    })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }
});
module.exports = router;
