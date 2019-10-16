var db = require("../models");
const middleware = require("../config/middleware/index");
const Op = db.Sequelize.Op

module.exports = function (app) {

  app.get("/", function (req, res) {
    if (!req.user) {
      res.render("index")
    }
    else {
      db.Event.findAll({
        where: {
          UserId: req.user.id
        },
        include: [db.User]
      }).then(function (dbEvents) {
        console.log(dbEvents);
        res.render("userHome", {
          events: dbEvents
        });
      });
    }

  });

  //user homepage
  app.get("/home", middleware.isLoggedIn, function (req, res) {
    db.Event.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function (dbUserEvents) {
      console.log(dbUserEvents);
      res.render("userHome", {
        msg: "Welcome Back",
        userEvents: dbUserEvents
      })
    })
  });

  //create event page
  app.get("/addevent", middleware.isLoggedIn, function (req, res) {
    db.Event.findAll({
      where: {
        UserId: req.user.id,

      }
    }).then(function (dbEvents) {
      console.log(dbEvents);
      res.render("addEvent", {
        msg: "Welcome!",
        events: dbEvents
      });
    });
  });

  //register user page
  // app.get("/adduser", function (req, res) {
  //   db.User.findAll({}).then(function (dbUsers) {
  //     res.render("addUser", {
  //       msg: "Add User",
  //       user: dbUsers
  //     });
  //   });
  // });

  // Create request page
  app.get("/request", middleware.isLoggedIn, function (req, res) {
    let user = req.user;
    db.User.findAll({
      where: {
        id: {
          [Op.not]: req.user.id
        }
      }
    }).then(function (dbUsers) {

      res.render("request", { users: dbUsers })
    })
  });

  //load event page and pass in an event by id
  app.get("/events/:id", function (req, res) {
    db.Event.findOne({
      where: {
        uuid: req.params.id
      }
    }).then(function (dbEvent) {
      res.render("event", {
        event: dbEvent
      });
    });
  });

  app.get("/inbox", middleware.isLoggedIn, function(req, res) {
    db.Invite.findAll({
      where: {
        UserId: req.user.id
      }, 
      include: [{
        model: db.Event,
        include: [db.User]
      }, {
        model: db.User
      }, {
        model: db.Request,
        include: [db.User]
      }]
    }).then(function (dbInvites) {
      res.render("inbox", {
        invites: dbInvites
      });
    }).catch(console.log("Error!"))
  })

  app.get("/invite/:id?", function (req, res) {
    db.Invite.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.Event,
        include: [db.User]
      }, {
        model: db.User
      }, {
        model: db.Request,
        include: [db.User]
      }]
    }).then(function (dbInvites) {
      res.json(dbInvites);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });

};
