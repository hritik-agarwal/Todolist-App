// importing some modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

// declaring express app and using and setting some modules
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // to use static files
app.set('view engine', 'ejs');

// Connecting to mongodb server
mongoose.connect("mongodb+srv://admin-hritik:cluster0_456@cluster0.9pbff.mongodb.net/todolistDB?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// Creating item schema
const itemsSchema = new mongoose.Schema({
  name: String
});

// Item Collections
const Item = mongoose.model("Item", itemsSchema);
const WorkItem = mongoose.model("WorkItem", itemsSchema);

// Default Todo List Item
const defaultitem1 = new Item({ name: "Welcome to ToDo List" });
const defaultitem2 = new Item({ name: "Add + button to add a new todo" });
const defaultitem3 = new Item({ name: "<-- Hit this to delete an item" });
const defaultitem = [defaultitem1, defaultitem2, defaultitem3];

// port
const PORT = 3000;
let first = true;

// General List get request
app.get("/", (req, res) => {
  Item.find(function (err, items) {
    data = { listType: date.getDate(), items: items }
    res.render('index', data);
  });
});

// General list post request
app.post("/", (req, res) => {
  if (req.body.button == "Work List") {
    const newTodo = new WorkItem({ name: req.body.item });
    newTodo.save();
    res.redirect("/work");
  } else {
    const newTodo = new Item({ name: req.body.item });
    newTodo.save();
    res.redirect("/");
  }
});

// Work list get request
app.get("/work", (req, res) => {
  WorkItem.find((err, items) => {
    data = { listType: "Work List", items: items, };
    res.render('index', data);
  });
});

// Work list post request
app.post("/work", (req, res) => {
  const newTodo = new WorkItem({ name: req.body.item });
  newTodo.save();
  res.redirect("/work");
});

// Deleting item
app.post("/delete", function (req, res) {
  const listType = req.body.listType;
  Item.deleteOne({ _id: req.body.name }, function (err) { if (err) console.log(err) });
  WorkItem.deleteOne({ _id: req.body.name }, function (err) { if (err) console.log(err) });
  if (listType == "Work List") res.redirect("/work");
  else res.redirect("/");
});

// listening on port
app.listen(PORT, () => console.log("Server Started on Port " + PORT));