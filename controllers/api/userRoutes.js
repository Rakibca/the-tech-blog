const router = require('express').Router();
const {
  Blog,
  User,
  Comment
} = require('../../models');
const withAuth = require('../../utils/auth');
const sequelize = require('../../config/connection');


// GET /api/users
router.get('/', async (req, res) => {
  // access the user model and run .findAll() method -- similar to SELECT * FROM users;
  try {
    const userData = await User.findAll({
        attributes: {
          exclude: ['[password']
        }
      })
      .then(userData => res.json(userData))
  } catch (err) {
    res.status(500).json(err);
  }
});


// GET a single user by id
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findOne({
      attributes: {
        exclude: ['password']
      },
      where: {
        id: req.params.id
      },
      include: [{
          model: Blog,
          attributes: [
            'id',
            'blog_title',
            'blog_description',
            'date_created'
          ]
        },
        // include the Comment model here:
        {
          model: Comment,
          attributes: ['id', 'comment_description', 'user_id', 'blog_id'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
    if (!userData) {
      res.status(404).json({
        message: 'There is no user with this id!'
      });
      return;
    }
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// CREATE new user
router.post('/', async (req, res) => {
  const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    // store user data during session
    .then(userData => {
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;
        res.json(userData);
      });
    });
});


// UPDATE a user
router.put('/:id', withAuth, async (req, res) => {
  try {
    const userData = await User.update(req.body, {
      individualHooks: true,
      where: {
        id: req.params.id
      }
    })
    if (!userData[0]) {
      res.status(404).json({
        message: 'There is no user with this id!'
      });
      return;
    }
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// DELETE a user
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const userData = await User.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!userData) {
      res.status(404).json({
        message: 'No user found with this id'
      });
      return;
    }
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// LOG IN for users/ verify users
router.post('/login', async (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  const userData = await User.findOne({
    where: {
      email: req.body.email
    }
  }).then(userData => {
    if (!userData) {
      res.status(400).json({
        message: 'No user with that email address!'
      });
      return;
    }
    // verify user
    const validPassword = userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({
        message: 'Password is incorrect!'
      });
      return;
    }
    req.session.save(() => {
      // declare session variables
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;

      res.json({
        user: userData,
        message: 'You are now logged in!'
      });
    });
  });
});


// LOG OUT
router.post('/logout', withAuth, async (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


module.exports = router;
