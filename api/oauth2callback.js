const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI,
}, (token, tokenSecret, profile, done) => {
  if (!profile) {
    return done(new Error("Profile is null"));
  }
  profile.token = token;
  return done(null, profile);
}));

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  passport.authenticate('google', { failureRedirect: '/' }, function(err, user, info) {
    if (err) {
      console.error("Authentication Error: ", err);
      return res.status(400).json({ error: 'Authentication failed' });
    }
    if (!user) {
      return res.status(400).json({ error: 'Authentication failed' });
    }
    if (!user.token) {
      return res.status(400).json({ error: 'Token not found' });
    }

    const token = user.token;
    const browser = req.query.browser;
    let redirectUrl = '';

    if (browser === 'chrome') {
      redirectUrl = `chrome-extension://bbcatcher@dorzairi.com/handleToken.html?token=${token}`;
    } else if (browser === 'firefox') {
      redirectUrl = `moz-extension://bbcatcher@dorzairi.com/handleToken.html?token=${token}`;
    } else {
      redirectUrl = `https://b-bcatcher-backend.vercel.app/error.html`;
    }

    res.redirect(redirectUrl);
  })(req, res);
};
