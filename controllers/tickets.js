const cloudinary = require("../middleware/cloudinary");
const Ticket = require("../models/Ticket");
const Comment = require("../models/Comment");
const User = require("../models/User");

module.exports = {
  getNewTicket: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const tickets = await Ticket.find({ user: req.user.id });
      const Users = await User.find().lean();
      //Sending post data from mongodb and user data to ejs template
      res.render("newTicket.ejs", { tickets: tickets, user: req.user, Users: Users });
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
      const tickets = await Ticket.find({ user: req.params.id }).sort({ createdAt: "desc"}).lean();
      //Sending post data from mongodb and user data to ejs template
      res.render("assigned.ejs", { tickets: tickets, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getDashboard: async (req, res) => {
    try {
      const tickets = await Ticket.find({status: {$ne : "Resolved"}}).sort({ severity: "asc", createdAt: "desc"}).lean();
      res.render("dashboard.ejs", { tickets: tickets, user:req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getTicket: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, ticketsController.getTicket);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const Users = await User.find().lean();
      const ticket = await Ticket.findById(req.params.id);
      const comments = await Comment.find({ticket: req.params.id}).sort({ createdAt: "desc" }).lean();
      const severity = ['P0','P1','P2','P3']
      const status = ['Open', 'Pending', 'Resolved']
      res.render("ticket.ejs", { Users: Users, ticket: ticket, user: req.user, comments: comments, severity: severity, status: status});
    } catch (err) {
      console.log(err);
    }
  },
  createTicket: async (req, res) => {
    try {
      // Upload image to cloudinary
      
      if (req.file !== undefined){
        const result = await cloudinary.uploader.upload(req.file.path);
        await Ticket.create({
          subject: req.body.subject,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          description: req.body.description,
          severity: req.body.severity,
          assignedTo: req.body.assignedTo,
          status: req.body.status,
          user: req.user.id,
        });
      }else{
        await Ticket.create({
          subject: req.body.subject,
          description: req.body.description,
          severity: req.body.severity,
          assignedTo: req.body.assignedTo,
          status: req.body.status,
          user: req.user.id,
        });
      }
      console.log("Ticket has been added!");
      res.redirect("/");
      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
    } catch (err) {
      console.log(err);
    }
  },
  commentTicket: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        user: req.user.id,
        ticket: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect("/ticket/"+req.params.id);
    } catch (err) {
      console.log(err);
    }
  },
  // likeTicket: async (req, res) => {
  //   try {
  //     await Ticket.findOneAndUpdate(
  //       { _id: req.params.id },
  //       {
  //         $inc: { likes: 1 },
  //       }
  //     );
  //     console.log("Likes +1");
  //     res.redirect(`/ticket/${req.params.id}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
  updateSeverity: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      await Ticket.findOneAndUpdate(
        { _id: req.params.id },
        {
          severity: req.body.severity,
        }
      );
      await Comment.create({
        comment: `${ticket.severity} -> ${req.body.severity}`,
        user: req.user.id,
        ticket: req.params.id,
      });
      console.log("Updated Severity");
      res.redirect(`/ticket/${req.params.id}#comments`);
    } catch (err) {
      console.log(err);
    }
  },
  updateStatus: async (req, res) => {
    try {
      await Ticket.findOneAndUpdate(
        { _id: req.params.id },
        {
          status: req.body.status,
        }
      );
      await Comment.create({
        comment: `Marked as ${req.body.status}`,
        user: req.user.id,
        ticket: req.params.id,
      });
      console.log("Updated Status");
      res.redirect(`/ticket/${req.params.id}#comments`);
    } catch (err) {
      console.log(err);
    }
  },
  updateAssignee: async (req, res) => {
    try {
      await Ticket.findOneAndUpdate(
        { _id: req.params.id },
        {
          assignedTo: req.body.assignedTo,
        }
      );
      await Comment.create({
        comment: `Assigned To: ${req.body.assignedTo}`,
        user: req.user.id,
        ticket: req.params.id,
      });
      console.log("Updated Assignee");
      res.redirect(`/ticket/${req.params.id}#comments`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteTicket: async (req, res) => {
    try {
      // Find ticket by id
      let ticket = await Ticket.findById({ _id: req.params.id });
      // Delete image from cloudinary
      if (ticket.cloudinaryId){
        await cloudinary.uploader.destroy(ticket.cloudinaryId);
      }
      // Delete ticket from db
      await Ticket.remove({ _id: req.params.id });
      await Comment.remove({ ticket: req.params.id });
      console.log("Deleted Ticket");
      res.redirect("/");
    } catch (err) {
      res.redirect("/");
    }
  },
};
