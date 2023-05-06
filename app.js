const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

const app = express();

//CONECTING DB// APP CONFI
mongoose.connect(
  "mongodb+srv://javidmuhammad679:Javid1591@cluster0.hqvjv3u.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//SCHEMA
let blogSchema = mongoose.Schema({
  title: String,
  image: {
    type: String,
    default: "imagePlaceholder.jpg",
  },
  body: String,
  created: {
    type: Date,
    default: Date.now,
  },
});

let Blog = mongoose.model("Blog", blogSchema);

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/blogs", (req, res) => {
  Blog.find({}, (error, blogs) => {
    if (error) {
      console.log(error);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

app.get("/blogs/new", (req, res) => {
  res.render("new");
});

app.post("/blogs", (req, res) => {
  Blog.create(req.body.blog, (error, newBlog) => {
    if (error) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id, (error, foundBlog) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (error, foundBlog) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error, updatedBlog) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

app.delete("/blogs/:id", (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (error) => {
    if (error) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3000, (req, res) => {
  console.log("The server is up and running on port 3000");
});
