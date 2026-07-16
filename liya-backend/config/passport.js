const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  // Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
          if (!user) return done(null, false, { message: 'User not found' });
          if (!user.password) return done(null, false, { message: 'Please login with your OAuth provider' });
          if (user.isBlocked) return done(null, false, { message: 'Your account has been blocked' });
          const isMatch = await user.comparePassword(password);
          return isMatch ? done(null, user) : done(null, false, { message: 'Password incorrect' });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Google OAuth Strategy (only if credentials are set)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${process.env.API_URL || ''}/api/auth/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });
            if (user) {
              if (user.isBlocked) return done(null, false, { message: 'Your account has been blocked' });
              return done(null, user);
            }
            user = await User.create({
              name: profile.displayName,
              email,
              authProvider: 'google',
              googleId: profile.id
            });
            return done(null, user);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
