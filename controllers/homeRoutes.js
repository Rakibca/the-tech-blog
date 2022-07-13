const router = require('express').Router();
const {
  Blog,
  User,
  Comment
} = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');


router.get('/', async (req, res) => {
  //console.log(req.session);
  try {
    // Get all projects and JOIN with user data
    const blogData = await Blog.findAll({
      attributes: [
        'id',
        'blog_title',
        'blog_description',
        'date_created'
      ],
      include: [{
          model: Comment,
          attributes: ['id', 'comment_description', 'user_id', 'blog_id'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    });
    // Serialize data so the template can read it
    const blogs = blogData.map(blog => blog.get({
      plain: true
    }));
    // Pass serialized data and session flag into template
    res.render('home', {
      blogs,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


//rendering one blog to the single-post page
router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'blog_title',
        'blog_description',
        'date_created'
      ],
      include: [{
          model: Comment,
          attributes: ['id', 'comment_description', 'user_id', 'blog_id'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    });
    if (!blogData) {
      res.status(404).json({
        message: 'There is no blog with this id!'
      });
      return;
    }
    // Serialize data so the template can read it
    const blogs = blogData.map(blog => blog.get({
      plain: true
    }));
    // pass data to template
    res.render('single-post', {
      blogs,
      loggedIn: req.session.loggedIn
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});


router.get('/signup', (req, res) => {
  res.render('signup');
});


module.exports = router;
