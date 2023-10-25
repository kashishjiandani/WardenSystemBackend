const wardenModel = require("../models/wardenModel");
const slotModel = require("../models/slotModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_TOKEN;
const { generateToken } = require('../middleware/authentication');

// Create user (admin)
exports.create = async (req, res) => {
    try {
        const { university_id, password } = req.body;

        // Check if the warden with the same university ID already exists
        const existingWarden = await wardenModel.findOne({ university_id });

        if (existingWarden) {
            return res.status(400).json({ success: false, error: "A warden with this University ID already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new warden
        const newWarden = await wardenModel.create({
            university_id,
            password: hashedPassword,
        });

        // Generate a bearer token for the new warden
        const token = jwt.sign({ user: newWarden._id }, jwtSecret, { expiresIn: '1h' });

        res.json({ success: true, authToken: token, warden: newWarden, message: "Warden created successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating warden." });
    }
}

// Login user (warden)
exports.login = async (req, res) => {
    try {
        const { university_id, password } = req.body;

        // Find the warden by university ID
        const warden = await wardenModel.findOne({ university_id });

        if (!warden || !await bcrypt.compare(password, warden.password)) {
            return res.status(401).json({ message: 'Invalid university ID or password' });
        }

        // Generate a bearer token for the logged-in warden
        const token = jwt.sign({ user: warden._id }, jwtSecret, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error during login' });
    }
}





