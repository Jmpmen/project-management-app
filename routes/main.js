const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const projectsController = require("../controllers/projects");
const { ensureAuth } = require("../middleware/auth");

//Main Routes 
router.get("/", ensureAuth, projectsController.getDashboard);

//Routes for user login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
