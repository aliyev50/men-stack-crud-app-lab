const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

const Food = require('./models/foods.js');

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"))


app.get('/', async (req, res) => {
  res.render('index.ejs')
});

app.get('/foods', async (req, res) => {
  const allFoods = await Food.find();
  res.render("foods/index.ejs", { foods: allFoods });
});

//GET /foods/new
app.get('/foods/new', (req, res) => {
  res.render('foods/new.ejs');
});

app.get('/foods/:foodId', async (req, res) => {
  const foundFood = await Food.findById(req.params.foodId);
  res.render('foods/show.ejs', {food: foundFood});
});

// POST /foods
app.post("/foods", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Food.create(req.body);
  res.redirect("/foods");
});

// Update /foods
app.put("/foods/:foodId", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Food.findByIdAndUpdate(req.params.foodId, req.body);
  res.redirect(`/foods/${req.params.foodId}`);
});

app.get("/foods/:foodId/edit", async (req, res) => {
  const foundFood = await Food.findById(req.params.foodId);
  res.render("foods/edit.ejs", {
    food: foundFood,
  });
});

app.delete("/foods/:foodId", async (req, res) => {
  await Food.findByIdAndDelete(req.params.foodId);
  res.redirect("/foods");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
