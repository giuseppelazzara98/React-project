"use strict";
const morgan = require("morgan"); //loggin middleware
const passport = require("passport"); //auth middleware
const session = require("express-session"); // session middleware
const express = require("express");
const app = new express();
const cors = require("cors");
app.use(morgan("dev"));
const port = 3001;

//MIDDLEWARE
app.use(express.json());
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOption));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

//USED DEFAULT METHOD DO STORE THE DATA (IN MEMORY)
app.use(
  session({
    secret:
      "a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie",
    resave: false,
    saveUninitialized: false,
  })
);

// USE OF SESSION COOKIES
app.use(passport.initialize());
app.use(passport.session());

//ROUTERS
const courses = require("./modules/routers/Courses");
const sessionR = require("./modules/routers/Session");
const studyplan = require("./modules/routers/Studyplan");
app.use("/api", courses);
app.use("/api", sessionR);
app.use("/api", studyplan);

module.exports = app;
