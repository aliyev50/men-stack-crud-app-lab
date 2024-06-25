const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

const Food = require('./models/foods.js');

//middleware
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => {
  res.render('index.ejs')
});

//GET /foods/new
app.get('/foods/new', (req, res) => {
  res.render('foods/new.ejs');
});

// POST /foods
app.post("/foods", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Food.create(req.body);
  res.redirect("/foods/new");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
