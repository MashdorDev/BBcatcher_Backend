const passport = require('passport');

module.exports = async (req, res) => {
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/tasks']
  })(req, res);
};
