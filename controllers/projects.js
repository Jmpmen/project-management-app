const Project = require("../models/Project");
const Task = require("../models/Task");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getDashboard: async (req, res) => {
    try {
      //router.get("/", ensureAuth, projectsController.getDashboard);
      //http://localhost:3000/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const projects = await Project.find().sort({ createdAt: "asc"}).lean();
      const Users = await User.find().lean();
      const todos = await Task.find({project: projects[0], status: 'To-Do'}).sort({ dueDate: "asc"}).lean();
      const doing = await Task.find({project: projects[0], status: 'Doing'}).sort({ dueDate: "asc"}).lean();
      const done = await Task.find({project: projects[0], status: 'Done'}).sort({ dueDate: "asc"}).lean();
      const comments = await Comment.find({project: projects[0]}).sort({ createdAt: "desc" }).lean();
      res.render("dashboard.ejs", { projects: projects, user: req.user, Users: Users, todos: todos, doing: doing, done: done, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  getProject: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, projectsController.getProject);
      //http://localhost:3000/project/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const project = await Project.findById(req.params.id);
      const projects = await Project.find().sort({ createdAt: "asc"}).lean();
      const Users = await User.find().lean();
      const todos = await Task.find({project: req.params.id, status: 'To-Do'}).sort({ dueDate: "asc"}).lean();
      const doing = await Task.find({project: req.params.id, status: 'Doing'}).sort({ dueDate: "asc"}).lean();
      const done = await Task.find({project: req.params.id, status: 'Done'}).sort({ dueDate: "asc"}).lean();
      const comments = await Comment.find({project: req.params.id}).sort({ createdAt: "desc" }).lean();
      res.render("project.ejs", { project: project, projects: projects, user: req.user, Users: Users, todos: todos, doing: doing, done: done, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  newProject: async (req, res) => {
    try {
      // Create new project
      await Project.create({
          name: req.body.name,
          description: req.body.description,
          user: req.user.id,
        });
      console.log("Project has been created!");
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  },
  newTask: async (req, res) => {
    try {
      // Create new task
      await Task.create({
          description: req.body.description,
          project: req.params.id,
          user: req.user.id,
          dueDate: req.body.dueDate,
          assignedTo: req.body.assignedTo,
          status: req.body.status,
        });
      console.log("Added new task!");
      res.redirect("/project/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  commentTask: async (req, res) => {
    try {
      // Create a comment using task id
      await Comment.create({
        comment: req.body.comment,
        user: req.user.id,
        userName: req.user.userName,
        task: req.params.id,
        project: req.params.project,
      });
      console.log("Comment has been added!");
      res.redirect("/project/"+req.params.project);
    } catch (err) {
      console.log(err);
    }
  },
  updateStatus: async (req, res) => {
    try {
      // Update status using task id to selected value
      await Task.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: req.body.status,
        }
      );
      console.log("Updated Status");
      res.redirect("/project/"+req.params.project);
    } catch (err) {
      console.log(err);
    }
  },
  updateAssignee: async (req, res) => {
    try {
      // Update assignee to selected value
      await Task.findOneAndUpdate(
        { _id: req.params.id },
        {
          assignedTo: req.body.assignedTo,
        }
      );
      console.log("Updated Assignee");
      res.redirect("/project/"+req.params.project)
    } catch (err) {
      console.log(err);
    }
  },
  assignToMe: async (req, res) => {
    try {
      // Update assignee to user email
      await Task.findOneAndUpdate(
        { _id: req.params.id },
        {
          assignedTo: req.user.email,
        }
      );
      console.log("Updated Assignee");
      res.redirect("/project/"+req.params.project)
    } catch (err) {
      console.log(err);
    }
  },
  deleteTask: async (req, res) => {
    console.log(req.params.id)
    try {
      // Delete project from db
      await Task.remove({ _id: req.params.id });
      await Comment.remove({ task: req.params.id });
      console.log("Deleted Task");
      res.redirect("/project/"+req.params.project);
    } catch (err) {
      console.log(err);
    }
  },
};
