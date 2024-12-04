const express = require("express");
const router = express.Router();
const categoryController = require("../admin/category.controller");

const Category = require("../../model/category.model");

router.post("/admin/category", async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.redirect("/admin/category/details");
  } catch (err) {
    res.status(500).send("Error saving product: " + err.message);
  }
});

router.get("/admin/category/create", (req, res) => {
  return res.render("admin/categoryForm", {
    layout: "adminLayout",
    pageTitle: "Create Category",
  });
});

router.get("/admin/category/details", async (req, res) => {
  try {
    const newCategory = await Category.find();

    return res.render("admin/category", {
      layout: "adminLayout",
      pageTitle: "Category Management",
      categories: newCategory,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error fetching products from the database.");
  }
});
router.get("/admin/category/edit/:id", categoryController.editCategory);
router.get("/admin/category/delete/:id", categoryController.delCategory);

router.post("/admin/category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { categoryName, imageName, type, linkName } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { categoryName, imageName, type, linkName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send("Category not found");
    }

    res.redirect("/admin/category/details");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating category: " + err.message);
  }
});
module.exports = router;
