const passport = require("passport");
const User_service = require("../modules/services/UserService");
const passportLocal = require("passport-local").Strategy;
const userService = new User_service();

passport.use(
  new passportLocal((username, password, done) => {
    userService.getUser(username, password).then((user) => {
      if (user === false)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });
      return done(null, user);
    });
  })
);
// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userService
    .getUserById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});
module.exports = passport;
