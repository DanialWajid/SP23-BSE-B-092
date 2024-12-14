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
let userRouter = require("./routes/route.user");
const { isAuthenticated, authorizeRole } = require("./middleware/auth");
const {
  sessionMiddleware,
  setUserSession,
  deleteUserSession,
} = require("./util/cookie");
server.use(sessionMiddleware);

dotenv.config({ path: ".env.local" });
server.use(express.urlencoded({ extended: true })); // For parsing form

server.get("/login", (req, res) => {
  res.render("login");
});
server.get("/logout", (req, res) => {
  res.render("/signup");
});
server.get("/checkout", (req, res) => {
  res.render("checkout");
});
server.get("/verify-email", (req, res) => {
  res.render("verify-email");
});

server.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/"); // Redirect to home page if user is already logged in
  }
  res.render("signup");
});

server.use(userRouter);
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

server.get("/", isAuthenticated, authorizeRole(["User"]), (req, res) => {
  // Check if the user is logged in by checking session or cookie
  if (!req.session.loggedIn) {
    return res.redirect("/signup"); // Redirect to signup page if not logged in
  }

  const loggedIn = req.session && req.session.userId ? true : false; // Check if user is logged in

  // Render the page and pass the loggedIn variable
  res.render("project", { loggedIn: loggedIn });
});

server.get("/myportfolio", (req, res) => {
  res.render("project");
});

server.listen(5001, () => {
  console.log("server started at localhost : 5001");
});
