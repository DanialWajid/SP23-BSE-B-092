const express = require("express");
var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

let createRouter = require("./routes/admin/create.controller");
server.use(createRouter);

server.get("/", (req, res) => {
  res.render("project");
});
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
