const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

// Initialize passport strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI
}, (token, tokenSecret, profile, done) => {
  // Here, you can choose what information you want to store in the user session
  profile.token = token;
  return done(null, profile);
}));

module.exports = (req, res) => {
  try {
    // Decode the state parameter to get the browser info
    const decoded = jwt.verify(req.query.state, SECRET, { algorithms: ['HS256'], ignoreExpiration: true });
    const browser = decoded.browser;

    passport.authenticate('google', { failureRedirect: '/' }, (err, user, info) => {
      if (err) return res.status(400).json({ error: "Authentication failed" });

      console.log(user);

      if (browser === 'chrome' || browser === 'firefox') {
        // Redirect to the bridge.html page hosted on your own Vercel app
        res.redirect(`https://b-bcatcher-backend.vercel.app/bridge.html?token=${user.token}&browser=${browser}`);
      } else {
        res.redirect('/error');
      }


    })(req, res);
  } catch (err) {
    console.error("Failed to decode JWT or retrieve browser", err);
    res.status(400).json({ error: "Invalid state parameter" });
  }
};
