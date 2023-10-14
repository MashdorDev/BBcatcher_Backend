const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const SECRET = process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI,
    },
    (token, tokenSecret, profile, done) => {
      console.log("Inside Google Strategy callback");
      return done(null, profile);
    }
  )
);

function detectBrowser(userAgent) {
  if (userAgent.includes("Chrome")) {
    return "chrome";
  } else if (userAgent.includes("Firefox")) {
    return "firefox";
  } else {
    return null;
  }
}

module.exports = (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'];
    const browser = detectBrowser(userAgent);

    if (!browser) {
      throw new Error("Browser information is required");
    }

    console.log(`Browser info from User-Agent: ${browser}`);
    const state = jwt.sign({ browser }, SECRET, { expiresIn: "1h" });

    const oauth2URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&state=${state}`;
    console.log(`Redirecting to OAuth2 URL: ${oauth2URL}`);

    return passport.authenticate("google", {
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/tasks",
      ],
      failureRedirect: "/",
      state: state,
    })(req, res, next);

  } catch (err) {
    console.error("Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
