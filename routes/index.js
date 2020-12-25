const express = require('express');
const router = express.Router();

// Welcome Page
router.get('/', (req, res) => console.log("Success"));

// Dashboard
router.get('/dashboard', (req, res) =>
  console.log("Success")
);

module.exports = router;
