const wardenModel = require("../models/wardenModel");
const slotModel = require("../models/slotModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_TOKEN;


// Create a new slot

exports.createSlot = async (req, res) => {
    try {
        const { warden_id, slot_time, slot_duration } = req.body;

        // Check if the slot is for a Thursday or Friday
        const slotDate = new Date(slot_time);
        const slotDay = slotDate.getUTCDay(); // 0 for Sunday, 1 for Monday, ...

        if (slotDay !== 4 && slotDay !== 5) {
            return res.status(400).json({ success: false, error: "Slots can only be created for Thursday or Friday" });
        }

        // Check if the slot is for 10 AM
        if (slotDate.getUTCHours() !== 10) {
            return res.status(400).json({ success: false, error: "Slots can only be created for 10 AM" });
        }

        // Check if there are any existing slots within the specified time frame
        const startTime = new Date(slot_time);
        const endTime = new Date(startTime.getTime() + slot_duration * 60000); // Convert slot_duration to milliseconds

        const existingSlots = await slotModel.find({
            warden_id,
            slot_time: { $gte: startTime, $lt: endTime },
        });

        if (existingSlots.length > 0) {
            return res.status(400).json({ success: false, error: "Slot overlaps with an existing slot" });
        }

        // Create the new slot
        const newSlot = await slotModel.create({
            warden_id,
            slot_time,
            slot_duration,
            slot_day: slotDay === 4 ? "Thursday" : "Friday", // Store the day name
        });

        res.json({ success: true, slot: newSlot, message: "Slot created successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating slot." });
    }
}

// View all pending slots for the logged-in warden 
exports.pendingSlots = async (req, res) => {
    try {
        const warden_id = req.user._id; // Extract the _id of the logged-in warden
        const currentDateTime = new Date();
        const slots = await slotModel
            .find({
                warden_id: warden_id,
                booked_by: { $exists: true },
                slot_time: { $gt: currentDateTime }, // Only show slots with a time in the future
            })
            .populate('warden_id', 'university_id')
            .populate('booked_by', 'university_id');

        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//view all slots which can be booked
exports.viewSlots = async (req, res) => {
    try {
        const slots = await slotModel.find({ booked_by: null });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//book a slot
exports.bookSlot = async (req, res) => {
    try {
        const { warden_id } = req.body;

        if (!warden_id) {
            return res.status(400).json({ message: 'Warden ID is required for booking a slot' });
        }

        const slot = await slotModel.findById(req.params.id);

        if (!slot || slot.booked_by) {
            return res.status(400).json({ message: 'Slot not available' });
        }

        if (slot.warden_id.equals(warden_id)) {
            return res.status(400).json({ message: 'You cannot book a slot you created' });
        }

        slot.booked_by = warden_id;
        await slot.save();

        res.json({ message: 'Slot booked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





