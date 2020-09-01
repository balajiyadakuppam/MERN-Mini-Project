const express = require("express")
const router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategories, updateCategory,removeCategory} = require("../controllers/category")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

router.param("userId",getUserById);
router.param("categoryId",getCategoryById);

//create routes
router.post("/category/create/:userId",isSignedIn, isAuthenticated, isAdmin, createCategory);

//get routes
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

//update routes
router.put("/category/:categoryId/:userId",isSignedIn, isAuthenticated, isAdmin, updateCategory);

//delete routes
router.delete("/category/:categoryId/:userId",isSignedIn,isAuthenticated,isAdmin, removeCategory);

module.exports = router;