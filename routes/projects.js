const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const projectsController = require("../controllers/projects");
const { ensureAuth } = require("../middleware/auth");

//Project Routes
//Since linked from server js treat each path as:
//project/:id, post/createProject, post/likeProject/:id, post/deleteProject/:id
router.get("/:id", ensureAuth, projectsController.getProject);


//Enables user to create project w/ cloudinary for media uploads
router.post("/newProject", projectsController.newProject);
router.post("/newTask/:id", projectsController.newTask);
router.post("/commentTask/:id/:project", projectsController.commentTask);


//Enables user to like project. In controller, uses POST model to update likes by 1
router.put("/updateSeverity/:id", projectsController.updateSeverity);
router.put("/updateStatus/:id/:project", projectsController.updateStatus);
router.put("/updateAssignee/:id/:project", projectsController.updateAssignee);


//Enables user to delete project. In controller, uses POST model to delete project from MongoDB collection
router.delete("/deleteProject/:id", projectsController.deleteProject);

module.exports = router;
