const express = require('express');
const router = express.Router();

// info
router.get('info', (req, res) => {
  res.json({
    developer: 'William Luo',
    website: 'www.cerulean.com',
    github: 'https://github.com/gluo7777'
  });
});

module.exports = router;
