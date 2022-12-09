const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const ticketsController = require("../controllers/tickets");
const { ensureAuth } = require("../middleware/auth");

//Ticket Routes
//Since linked from server js treat each path as:
//ticket/:id, post/createTicket, post/likeTicket/:id, post/deleteTicket/:id
router.get("/:id", ensureAuth, ticketsController.getTicket);


//Enables user to create ticket w/ cloudinary for media uploads
router.post("/createTicket", upload.single("file"), ticketsController.createTicket);
router.post("/commentTicket/:id", ticketsController.commentTicket);


//Enables user to like ticket. In controller, uses POST model to update likes by 1
router.put("/updateSeverity/:id", ticketsController.updateSeverity);
router.put("/updateStatus/:id", ticketsController.updateStatus);
router.put("/updateAssignee/:id", ticketsController.updateAssignee);


//Enables user to delete ticket. In controller, uses POST model to delete ticket from MongoDB collection
router.delete("/deleteTicket/:id", ticketsController.deleteTicket);

module.exports = router;
