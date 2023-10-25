const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const { create, login } = require("../controllers/wardenController");

// Create warden
router.route('/create').post(create);

// Login warden and get a token
router.route('/login').post(login);


module.exports = router;

