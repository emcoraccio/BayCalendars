const db = require("../models");
const passport = require("passport");

module.exports = function (app) {

  app.post('/api/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  app.post("/api/signup", function (req, res) {

    db.User.create({
      name: req.body.name,
      username: req.body.email,
      password: req.body.password
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  //gives back some user data
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {

      res.json({});
    } else {

      res.json({
        name: req.user.name,
        username: req.user.email,
        id: req.user.id
      });
    }
  });


  //get all events

  app.get("/api/events", function (req, res) {
    db.Event.findAll({}).then(function (dbEvent) {

      res.json(dbEvent);
    });
  });

  //get all users

  app.get("/api/user", function (req, res) {
    db.User.findAll({}).then(function (dbUser) {
      res.json(dbUser);
    })
  })


  //create new event

  app.post("/api/events", function (req, res) {
    db.Event.create(req.body).then(function (dbEvent) {
      console.log(dbEvent)
      res.json(dbEvent);
    });
  });

  //add new user
  app.post("/api/users", function (res, req) {
    db.User.create(req.body).then(function (dbUser) {
      console.log("Firing Api Users!")
      console.log(dbUser);
      res.json(dbUser);

    });
  })


  //Delete an event by id
  app.delete("/api/events/:id", function (req, res) {
    db.Event.destroy({ where: { id: req.params.id } }).then(function (dbEvent) {
      res.json(dbEvent);
    });
  });

  //Delete user by id
  app.delete("/api/users/:id", function (req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  //Edit event
  app.put("/api/posts", function (req, res) {
    db.Event.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbEvent) {
        res.json(dbPost);
      })
  })

};
