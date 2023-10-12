const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI,
}, (token, tokenSecret, profile, done) => {
  // Assuming the token is part of the profile object
  profile.token = token;
  return done(null, profile);
}));

module.exports = (req, res) => {
  passport.authenticate('google', { failureRedirect: '/' }, function(err, user, info) {
    if (err) {
      // Handle error
      return res.status(400).json({ error: 'Authentication failed' });
    }
    if (!user) {
      // Handle failed authentication
      return res.status(400).json({ error: 'User not found' });
    }

    const token = user.token;
    const browser = req.query.browser;

    let redirectUrl = '';
    if (browser === 'chrome') {
      redirectUrl = `chrome-extension://bbcatcher@dorzairi.com/handleToken.html?token=${token}`;
    } else if (browser === 'firefox') {
      redirectUrl = `moz-extension://bbcatcher@dorzairi.com/handleToken.html?token=${token}`;
    } else {
      // Fallback or error handling
      redirectUrl = `https://b-bcatcher-backend.vercel.app/error.html`;
    }

    res.redirect(redirectUrl);
  })(req, res);
};
