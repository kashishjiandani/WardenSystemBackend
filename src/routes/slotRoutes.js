const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const { createSlot,viewSlots,bookSlot,pendingSlots } = require("../controllers/slotController");

// Create slot
router.route('/create').post(createSlot);

// Get all available slots (GET request)
router.route('/all').get(authenticateUser, viewSlots);

// Book a slot (POST request)
router.route('/book/:id').post(authenticateUser, bookSlot);

// Get all pending sessions of the warden (GET request)
router.route('/pending').get(authenticateUser, pendingSlots);

module.exports = router;