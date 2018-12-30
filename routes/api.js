const express = require('express');
const router = express.Router();

// info
router.get('/info', (req, res) => {
  res.json({
    developer: 'William Luo',
    website: 'https://www.ceruleanmind.com',
    github: 'https://github.com/gluo7777'
  });
});

module.exports = router;
