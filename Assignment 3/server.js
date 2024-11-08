const express = require("express");

let server = express();
server.set("view engine", "ejs");
server.use(express.static("public"));

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
  console.log("server started at localhost : 5000");
});
