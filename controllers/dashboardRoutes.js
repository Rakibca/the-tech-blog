const router = require('express').Router();
const {
  Blog,
  User,
  Comment
} = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');


// dashboard displaying blogs created by logged in users
router.get('/', withAuth, async (req, res) => {
  try {
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
    res.render('dashboard', {
      blogs,
      loggedIn: true
    });

  } catch (err) {
    res.status(500).json(err);
  }
});


// rendering edit page
router.get('/edit/:id', withAuth, async (req, res) => {
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
    })
    // Serialize data so the template can read it
    const blogs = blogData.map(blog => blog.get({
      plain: true
    }));
    res.render('editBlogs', {
      blogs,
      loggedIn: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// rendering newpost page
router.get('/newblog', (req, res) => {
  res.render('newBlogs');
});


module.exports = router;
