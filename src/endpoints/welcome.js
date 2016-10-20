const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/', (req, res, next) => {
  res.json({
    'message': 'Hi, welcome to the SEAN Stack for API-based apps. For more information, visit https://github.com/sean-js/sean-api'
  })
});
