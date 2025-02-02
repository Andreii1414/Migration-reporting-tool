require("dotenv").config();
const passport = require("passport");
const User = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const verifyCallback = async (accessToken, refreshToken, profile, done) => {
  const badResponse = { isSuccess: false };

  if (!profile.emails || profile.emails.length === 0) {
    return done(null, badResponse);
  }

  const email = profile.emails[0].value.toLowerCase();
  const googleId = profile.id;
  const profilePhoto = profile.photos ? profile.photos[0].value : null;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        userName: profile.displayName,
        email,
        googleId,
        profilePhoto,
        verified: true,
      });
    }

    return done(null, user);
  } catch (error) {
    return done(null, badResponse);
  }
};

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      verifyCallback(accessToken, refreshToken, profile, done);
    }
  )
);

module.exports = passport;
