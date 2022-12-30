const cloudinary = require("../middleware/cloudinary");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getNewProject: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const projects = await Project.find({ user: req.user.id });
      const Users = await User.find().lean();
      //Sending post data from mongodb and user data to ejs template
      res.render("newProject.ejs", { projects: projects, user: req.user, Users: Users });
    } catch (err) {
      console.log(err);
    }
  },
  getUser: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const projects = await Project.find({ user: req.params.id }).sort({ createdAt: "desc"}).lean();
      //Sending post data from mongodb and user data to ejs template
      res.render("assigned.ejs", { projects: projects, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getDashboard: async (req, res) => {
    try {
      const projects = await Project.find().sort({ dueDate: "asc"}).lean();
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
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const project = await Project.findById(req.params.id);
      const projects = await Project.find().sort({ dueDate: "asc"}).lean();
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
      await Project.create({
          name: req.body.name,
          description: req.body.description,
          user: req.user.id,
          dueDate: req.body.dueDate,
        });
      console.log("Project has been created!");
      res.redirect("/");
      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
    } catch (err) {
      console.log(err);
    }
  },
  newTask: async (req, res) => {
    try {
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
      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
    } catch (err) {
      console.log(err);
    }
  },
  commentTask: async (req, res) => {
    console.log(req)
    try {
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
  // likeProject: async (req, res) => {
  //   try {
  //     await Project.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { likes: 1 },
  //       }
  //     );
  //     console.log("Likes +1");
  //     res.redirect(`/project/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  updateSeverity: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      await Project.findOneAndUpdate(
        { _id: req.params.id },
        {
          severity: req.body.severity,
        }
      );
      await Comment.create({
        comment: `${project.severity} -> ${req.body.severity}`,
        user: req.user.id,
        project: req.params.id,
      });
      console.log("Updated Severity");
      res.redirect(`/project/${req.params.id}#comments`);
    } catch (err) {
      console.log(err);
    }
  },
  updateStatus: async (req, res) => {
    console.log(req.user)
    try {
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
      await Task.findOneAndUpdate(
        { _id: req.params.id },
        {
          assignedTo: req.body.assignedTo,
        }
      );
      // await Comment.create({
      //   comment: `Assigned To: ${req.body.assignedTo}`,
      //   user: req.user.id,
      //   project: req.params.id,
      // });
      console.log("Updated Assignee");
      // res.redirect(`/project/${req.params.id}#comments`);
      res.redirect("/project/"+req.params.project)
    } catch (err) {
      console.log(err);
    }
  },
  deleteProject: async (req, res) => {
    try {
      // Find project by id
      let project = await Project.findById({ _id: req.params.id });
      // Delete image from cloudinary
      if (project.cloudinaryId){
        await cloudinary.uploader.destroy(project.cloudinaryId);
      }
      // Delete project from db
      await Project.remove({ _id: req.params.id });
      await Comment.remove({ project: req.params.id });
      console.log("Deleted Project");
      res.redirect("/");
    } catch (err) {
      res.redirect("/");
    }
  },
};
