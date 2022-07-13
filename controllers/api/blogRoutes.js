const router = require('express').Router();
const {
  Blog,
  User,
  Comment
} = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');


// GET all posts
router.get('/', async (req, res) => {
  //console.log('======================');
  try {
    const blogData = await Blog.findAll({
      // Query configuration
      attributes: [
        'id',
        'blog_title',
        'blog_description',
        'date_created'
      ],
      // show latest news first
      order: [
        ['created_at', 'DESC']
      ],
      // JOIN to the User table
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
    res.json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// GET a single post by id
router.get('/:id', async (req, res) => {
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
    res.json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// CREATE a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.create({
      blog_title: req.body.blog_title,
      blog_description: req.body.blog_description,
      user_id: req.session.user_id
    })
    res.json(blogData)
  } catch (err) {
    res.status(500).json(err);
  }
});


// UPDATE a post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.update({
      blog_title: req.body.blog_title,
      blog_description: req.body.blog_description
    }, {
      where: {
        id: req.params.id
      }
    })
    if (!blogData) {
      res.status(404).json({
        message: 'There is no blog with this id!'
      });
      return;
    }
    res.json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// DELETE A post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const blogData = await Blog.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!blogData) {
      res.status(404).json({
        message: 'There is no blog with this id!'
      });
      return;
    }
    res.json(blogData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
