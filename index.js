const express = require('express');
const cors = require("cors");
const app = express();
require("dotenv").config();

const port = 8080;


app.use(express.json())


const mongoose = require("mongoose");
MongoDB_URL = process.env.MONGODB_URL;
mongoose.connect(MongoDB_URL);
var db = mongoose.connection

db.on("Error", console.error.bind(console, "Connection error : "));
db.once("open", function () {
  console.log(`Database connection established at ${MongoDB_URL}`);
});


app.use(cors());

app.get('/', (req, res) => {
  res.send('App is working!')
})

app.use("/api/warden", require("./src/routes/wardenRoutes"));
app.use("/api/slot", require("./src/routes/slotRoutes"));

app.use('/*', (req, res) => {
  res.send('Invalid Request')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})