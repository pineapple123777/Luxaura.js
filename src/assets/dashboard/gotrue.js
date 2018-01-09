"use strict";

var _gotrueJs = require("gotrue-js");

var _gotrueJs2 = _interopRequireDefault(_gotrueJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = new _gotrueJs2.default();

auth.signup(email, password).then(function (response) {
  return console.log("Confirmation email sent");
}, function (error) {
  return console.log("Error during signup: %o", error.msg);
});

auth.confirm(token).then(function (user) {
  return console.log("Logged in as %s", user.user_metadata.full_name);
}, function (error) {
  return console.log("Failed to log in: %o", error);
});

auth.login(email, password).then(function (user) {
  return console.log("Logged in as %s", user.user_metadata.full_name);
}, function (error) {
  return console.log("Failed to log in: %o", error);
});

auth.requestPasswordRecovery(email).then(function (response) {
  return console.log("Recovery email sent");
}, function (error) {
  return console.log("Error sending recovery mail: %o", error);
});

auth.recover(token).then(function (user) {
  return console.log("Logged in as %s", user.email);
}, function (error) {
  return console.log("Failed to verify recover token: %o", error);
});

var user = auth.currentUser();

user.update({ email: newEmail, password: newPassword }).then(function (user) {
  return console.log("Updated user");
}, function (error) {
  return console.log("Failed to update user: %o", error);
});

user.jwt().then(function (token) {
  return console.log("Current token: %s", token);
}, function (error) {
  return console.log("Failed to get token: %o", error);
});

user.logout().then(function (response) {
  return console.log("User logged out");
}, function (error) {
  return console.log("Failed to logout user: %o", error);
});
