const router = require('express').Router();
const {
  Post,
  User,
  Comment
} = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [{
        model: User,
        attributes: ['name'],
      }, ],
    });

    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({
      plain: true
    }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    if (!req.session.logged_in) {
      res.redirect("/login");
      return;
    }

    const postDataDb = await Post.findByPk(req.params.id,{
        attributes: ["id", "name", "description", "date_created"],
        include: {
            model: User,
            attributes: ["name"]
        },
    })
    const commentDataDb = await Comment.findAll({
        where: {
            post_id: req.params.id
        },
        attributes: ["id", "description", "date_created"],
        include: {
            model: User,
            attributes: ["name"]
        }
    })

    const postData = await postDataDb.get({plain : true})
    const commentData = await commentDataDb.map(comment => comment.get({plain: true}))
    postData.comments = commentData;


    res.render("post", {
        postData,
        logged_in: req.session.logged_in
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Post
      }],
    });

    const user = userData.get({
      plain: true
    });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
