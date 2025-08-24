import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

// Models
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';

import config from '../config.js';
import { generateUniqueUsername } from '../utils/username.js';

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: config.google_client_id,
  clientSecret: config.google_client_secret,
  callbackURL: config.google_callback_url
},

async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const displayName = profile.displayName;

    let user = await User.findByEmail(email);
    if (!user) {
      const uniqueUsername = await generateUniqueUsername(displayName);

      const newUserId = await User.create({
        username: uniqueUsername,
        email,
        password: null,
        auth_provider: 'google',
        verification_token: null,
	email_verified: true
      });

      // Crear perfil de usuario
      await UserProfile.create(newUserId);

      user = await User.findByEmail(email);
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialización para uso de sesiones
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
