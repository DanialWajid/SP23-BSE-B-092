const express = require("express");
const mongoose = require("mongoose");
var expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
let server = express();
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));
server.use(express.json());

let adminProductsRouter = require("./routes/admin/products.controller");
let adminCategoryRouter = require("./routes/admin/category.routes");
let ProjectRouter = require("./routes/admin/project.controller");
let adminProjectRouter = require("./routes/admin/projdetail.controller");
let mainPageRouter = require("./routes/route.main");
let womenPageRouter = require("./routes/route.women");
let menPageRouter = require("./routes/route.men");
let kidsPageRouter = require("./routes/route.kids");
let babyPageRouter = require("./routes/route.baby");
let clickandcollectPageRouter = require("./routes/route.clickandcollect");
let homePageRouter = require("./routes/route.home");

dotenv.config({ path: ".env.local" });
server.use(adminProductsRouter);
server.use(adminCategoryRouter);
server.use(adminProjectRouter);
server.use(ProjectRouter);
server.use(mainPageRouter);
server.use(womenPageRouter);
server.use(menPageRouter);
server.use(kidsPageRouter);
server.use(babyPageRouter);
server.use(clickandcollectPageRouter);
server.use(homePageRouter);

let createRouter = require("./routes/admin/create.controller");
server.use(createRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/project")
  .then(() => console.log("Connected! to mongoDB"));

server.get("/", (req, res) => {
  res.render("project");
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
