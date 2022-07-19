const router = require('express').Router();
const {
  Post,
  User,
  Comment
} = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');


router.get('/', withAuth, (req, res) => {
  Post.findAll({
      where: {
        // use the ID from the session
        user_id: req.session.user_id,
      },
      attributes: [
        'id',
        'name',
        'description',
        'date_created',
        'user_id',
      ],
      include: [
        {
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
      // serialize data before passing to template
      const posts = dbPostData.map((post) => post.get({
        plain: true
      }));
      res.render('dashboard', {
        posts,
        logged_in: true
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


//GET posts/edit/i
router.get('/edit/:id', withAuth, async (req, res) => {
      try {
        const postData = await Post.findOne({
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
          include: [
            {
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

        const post = postData.get({
          plain: true
        });

        res.render('editpost', {
          post,
          logged_in: true,
        });
      } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      });

    module.exports = router;
