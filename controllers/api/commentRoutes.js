const router = require('express').Router();
const {
  Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, (req, res) => {
    if (req.session) {
    Comment.create({
        commentText: req.body.commentText,
        post_id: req.body.post_id,
        user_id: req.session.user_id,
    })
        .then(commentData => res.json(commentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }
});


module.exports = router;
