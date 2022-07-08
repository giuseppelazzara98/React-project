"use strict";
const express = require("express");
const routerUser = express.Router();
const passport = require("../passport");

routerUser.post("/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

routerUser.delete("/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

routerUser.get("/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Unauthenticated user!" });
});

module.exports = routerUser;
