const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const ticketsController = require("../controllers/tickets");
const { ensureAuth } = require("../middleware/auth");

//Main Routes 
router.get("/", ensureAuth, ticketsController.getDashboard);
router.get("/user/:id", ensureAuth, ticketsController.getUser);

// Route for creating new ticket
router.get("/newTicket", ensureAuth, ticketsController.getNewTicket);


//Routes for user login/signup
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
