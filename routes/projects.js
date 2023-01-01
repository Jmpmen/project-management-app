const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/projects");
const { ensureAuth } = require("../middleware/auth");

//Project Routes
//Since linked from server js treat each path as:
//project/:id, project/newProject, project/newTask/:id, project/commentTask/:id/:project, project/deleteProject/:id
router.get("/:id", ensureAuth, projectsController.getProject);

//Enables user to create project w/ cloudinary for media uploads
router.post("/newProject", projectsController.newProject);
router.post("/newTask/:id", projectsController.newTask);
router.post("/commentTask/:id/:project", projectsController.commentTask);

//Enables user to like project. In controller, uses POST model to update
router.put("/updateStatus/:id/:project", projectsController.updateStatus);
router.put("/updateAssignee/:id/:project", projectsController.updateAssignee);
router.put("/assignToMe/:id/:project", projectsController.assignToMe);

//Enables user to delete task. In controller, uses POST model to delete task from MongoDB collection
router.delete("/deleteTask/:id/:project", projectsController.deleteTask);

module.exports = router;
