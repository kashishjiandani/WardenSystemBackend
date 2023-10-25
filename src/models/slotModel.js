const mongoose = require('mongoose');

const slot = new mongoose.Schema({
     warden_id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'warden'
     },
     slot_time: {
       type: Date,
       required: true
     },
     slot_duration: {
      type: Number, // Slot duration in minutes
      required: true,
    },
    slot_day: {
      type: String, // Slot day (e.g., "Thursday", "Friday")
      required: true,
    },
     booked_by: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'warden'
     }
   });
   
   module.exports = mongoose.model('slot', slot);