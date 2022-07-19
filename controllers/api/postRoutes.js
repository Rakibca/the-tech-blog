const router = require('express').Router();
const {
  Post
} = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({
        message: 'No post found with this id!'
      });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.update(
      req.body, {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

    if (!postData) {
      res.status(404).json({
        message: 'No post found with this id!'
      });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

///////////////////////////////////////////////////////////////////////////////

router.get('/', (req, res) => {
  Post.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'date_created',
        'user_id',
      ],
      order: [
        ['date_created', 'description']
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
    .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


router.get('/:id', (req, res) => {
  Post.findOne({
      where: {
        id: req.params.id
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
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({
          message: 'No post found with this id'
        });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
