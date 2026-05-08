const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/portfolio/:username', (req, res) => {
  const username = req.params.username;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, users) => {

      if (users.length === 0) {
        return res.send('Usuario no encontrado');
      }

      const portfolioUser = users[0];

      db.query(
        'SELECT * FROM projects WHERE user_id = ?',
        [portfolioUser.id],
        (err, projects) => {

          db.query(
            'SELECT * FROM social_links WHERE user_id = ?',
            [portfolioUser.id],
            (err, links) => {

              res.render('portfolio', {
                portfolioUser,
                projects,
                links,
                sessionUser: req.session.user
              });
            }
          );
        }
      );
    }
  );
});

module.exports = router;