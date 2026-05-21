const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/portfolio/:username', (req, res) => {
  const username = req.params.username;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, users) => {
      if (err) {
        console.error('Portfolio query error:', err);
        return res.status(500).render('error', { message: 'Error en el servidor' });
      }

      if (!users || users.length === 0) {
        return res.status(404).render('error', { message: 'Usuario no encontrado' });
      }

      const portfolioUser = users[0];

      db.query(
        'SELECT * FROM projects WHERE user_id = ?',
        [portfolioUser.id],
        (err, projects) => {
          if (err) console.error('Projects query error:', err);

          db.query(
            'SELECT * FROM social_links WHERE user_id = ?',
            [portfolioUser.id],
            (err, links) => {
              if (err) console.error('Links query error:', err);

              res.render('portfolio', {
                portfolioUser,
                projects: projects || [],
                links: links || [],
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