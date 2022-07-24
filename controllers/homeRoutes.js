const router = require('express').Router();
const {
  Post,
  User,
  Comment
} = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');


router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'date_created',
        'user_id',
      ],
      include: [{
          model: Comment,
          attributes: ['id', 'commentText', 'date_created', 'user_id', 'post_id'],
          include: {
            model: User,
            attributes: ['name'],
          },
        },
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    const posts = postData.map((post) => post.get({
      plain: true
    }));
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/post/:id', (req, res) => {
  Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: [
        'id',
        'name',
        'description',
        'date_created',
        'user_id',
      ],
      include: [{
          model: Comment,
          attributes: ['id', 'commentText', 'date_created', 'user_id', 'post_id'],
          include: {
            model: User,
            attributes: ['name'],
          },
        },
        {
          model: User,
          attributes: ['name'],
        },
      ],
    })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({
          message: 'No post found with this id'
        });
      }

      const post = dbPostData.get({
        plain: true
      });

      res.render('post', {
        post,
        logged_in: req.session.logged_in
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});


router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('signup');
});

module.exports = router;
