import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import config from '../config.js';

passport.use(new GoogleStrategy({
  clientID: config.google_client_id,
  clientSecret: config.google_client_secret,
  callbackURL: config.google_callback_url
},

async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const username = profile.displayName;

    let user = await User.findByEmail(email);
    if (!user) {
      await User.create({
        username,
        email,
        password: null,
        verification_token: null
      });
      user = await User.findByEmail(email);
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialización opcional si deseas sesiones
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
