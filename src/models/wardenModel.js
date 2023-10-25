const mongoose = require('mongoose');
   
   const warden = new mongoose.Schema({
     university_id: {
       type: String,
       required: true,
       unique: true
     },
     password: {
       type: String,
       required: true
     }
   });
   
   module.exports = mongoose.model('warden', warden);


