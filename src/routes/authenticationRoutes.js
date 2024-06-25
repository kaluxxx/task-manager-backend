const express = require('express');
const authenticationController = require('../controllers/authenticationController');

const router = express.Router();

router.post('/login', authenticationController.login);
router.post('/register', authenticationController.register);

module.exports = router;