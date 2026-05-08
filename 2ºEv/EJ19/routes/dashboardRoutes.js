const express = require('express');
const router = express.Router();
const db = require('../config/db');
const isAuthenticated = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, (req, res) => {

  const userId = req.session.user.id;

  db.query(
    'SELECT * FROM projects WHERE user_id = ?',
    [userId],
    (err, projects) => {

      db.query(
        'SELECT * FROM social_links WHERE user_id = ?',
        [userId],
        (err, links) => {

          res.render('dashboard', {
            user: req.session.user,
            projects,
            links
          });

        }
      );

    }
  );

});

router.post('/update-profile', isAuthenticated, (req, res) => {

  const { bio, email } = req.body;
  const userId = req.session.user.id;

  db.query(
    'UPDATE users SET bio = ?, email = ? WHERE id = ?',
    [bio, email, userId],
    () => {

      req.session.user.bio = bio;
      req.session.user.email = email;

      res.redirect('/dashboard');

    }
  );

});

router.post('/add-social', isAuthenticated, (req, res) => {

  const { platform, url } = req.body;
  const userId = req.session.user.id;

  db.query(
    'INSERT INTO social_links (platform, url, user_id) VALUES (?, ?, ?)',
    [platform, url, userId],
    () => {
      res.redirect('/dashboard');
    }
  );

});

router.get('/delete-social/:id', isAuthenticated, (req, res) => {

  const socialId = req.params.id;
  const userId = req.session.user.id;

  db.query(
    'DELETE FROM social_links WHERE id = ? AND user_id = ?',
    [socialId, userId],
    () => {
      res.redirect('/dashboard');
    }
  );

});

router.post('/add-project', isAuthenticated, (req, res) => {

  const { title, description, repo_url, live_url } = req.body;

  const userId = req.session.user.id;

  db.query(
    `INSERT INTO projects
    (title, description, repo_url, live_url, user_id)
    VALUES (?, ?, ?, ?, ?)`,
    [title, description, repo_url, live_url, userId],
    () => {
      res.redirect('/dashboard');
    }
  );

});

router.get('/edit-project/:id', isAuthenticated, (req, res) => {

  const projectId = req.params.id;
  const userId = req.session.user.id;

  db.query(
    'SELECT * FROM projects WHERE id = ? AND user_id = ?',
    [projectId, userId],
    (err, results) => {

      if (results.length === 0) {
        return res.send('No autorizado');
      }

      res.render('edit-project', {
        project: results[0]
      });

    }
  );

});

router.post('/edit-project/:id', isAuthenticated, (req, res) => {

  const projectId = req.params.id;
  const userId = req.session.user.id;

  const { title, description, repo_url, live_url } = req.body;

  db.query(
    `UPDATE projects
     SET title = ?, description = ?, repo_url = ?, live_url = ?
     WHERE id = ? AND user_id = ?`,
    [title, description, repo_url, live_url, projectId, userId],
    () => {
      res.redirect('/dashboard');
    }
  );

});

router.get('/delete-project/:id', isAuthenticated, (req, res) => {

  const projectId = req.params.id;
  const userId = req.session.user.id;

  db.query(
    'DELETE FROM projects WHERE id = ? AND user_id = ?',
    [projectId, userId],
    () => {
      res.redirect('/dashboard');
    }
  );

});

module.exports = router;