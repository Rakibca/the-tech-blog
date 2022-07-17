const router = require('express').Router();
const {
  Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


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
