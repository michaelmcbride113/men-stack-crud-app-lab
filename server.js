const dotenv = require("dotenv");
dotenv.config();
const express = require('express');
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");

const app = express();

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected on MongoDB ${mongoose.connection.name}`)
});

const Cat = require("./models/cats.js")

// middleware

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// GET routes
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

// GET /cats/new
app.get("/cats/new", (req, res) => {
    res.render("cats/new.ejs")
})

// GET /cats
app.get("/cats", async (req, res) => {
    const allCats = await Cat.find();
    console.log(allCats);
    res.render("cats/index.ejs", { cats: allCats })
})

app.get("/cats/:catsId", async (req,res) => {
const foundCat = await Cat.findById(req.params.catsId);
res.render("cats/show.ejs", { cat: foundCat})
});


// Post
app.post("/cats", async (req, res) => {
    if (req.body.isReadyToPet === "on") {
      req.body.isReadyToPet = true;
    } else {
      req.body.isReadyToPet = false;
    }
    await Cat.create(req.body);
    res.redirect("/cats");
  });

// Delete
app.delete("/cats/:catId", async (req, res) => {
    await Cat.findByIdAndDelete(req.params.catId);
    res.redirect("/cats");
});

// Edits
app.get("/cats/:catId/edit", async (req, res) => {
    const foundCat = await Cat.findById(req.params.catId);
    res.render("cats/edit.ejs", {
        cat: foundCat,
    });
});

// PUT
app.put("/cats/:catId", async (req, res) => {
    if (req.body.isReadyToPet === "on") {
        req.body.isReadyToPet = true;
    } else {
        req.body.isReadyToPet = false;
    }

    await Cat.findByIdAndUpdate(req.params.catId, req.body);
    res.redirect(`/cats/${req.params.catId}`);
});



app.listen(3000, () => {
  console.log('Listening on port 3000');
});
