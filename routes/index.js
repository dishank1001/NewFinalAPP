const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', () => console.log("Success"));

// Dashboard
router.get('/dashboard', () =>
  console.log("Success")
);

module.exports = router;
