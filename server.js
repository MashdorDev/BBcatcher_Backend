require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const fetch = require('node-fetch');  // Added this line

const app = express();
app.use(express.static('public'));

// Setup passport
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI,
}, (token, tokenSecret, profile, done) => {
  return done(null, profile);
}));

app.use(cors());

app.get('/start-auth',
  passport.authenticate('google', {
    scope: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/tasks']
  })
);

app.get('/oauth2callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect(`https://your-actual-extension-url.com/?token=${req.user.token}`);
  }
);

app.get('/validate-token', async (req, res) => {
  const accessToken = req.query.access_token;
  const validationURL = `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`;
  try {
    const response = await fetch(validationURL, { method: 'GET' });
    const json = await response.json();
    if (json.aud && json.aud === process.env.GOOGLE_CLIENT_ID) {
      res.json(json);
    } else {
      throw new Error("Token validation error");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
