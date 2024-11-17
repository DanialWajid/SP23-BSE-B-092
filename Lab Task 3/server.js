const express = require("express");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.json());
let adminProductsRouter = require("./routes/admin/products.controller");
let ProjectRouter = require("./routes/admin/project.controller");
let adminProjectRouter = require("./routes/admin/projdetail.controller");
server.use(adminProductsRouter);
server.use(adminProjectRouter);
server.use(ProjectRouter);

let createRouter = require("./routes/admin/create.controller");
server.use(createRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/project")
  .then(() => console.log("Connected! to mongoDB"));

server.get("/index", (req, res) => {
  res.render("index");
});

server.get("/checkout", (req, res) => {
  res.render("checkout");
});
server.get("/login", (req, res) => {
  res.render("login");
});
server.get("/signup", (req, res) => {
  res.render("signup");
});
server.get("/myportfolio", (req, res) => {
  res.render("project");
});

server.listen(5001, () => {
  console.log("server started at localhost : 5001");
});
