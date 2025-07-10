import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import User from '../models/User.js';
import config from '../config.js';

// Google Strategy
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

// Microsft Strategy
passport.use(new MicrosoftStrategy({
  clientID: config.microsoft_client_id,
  clientSecret: config.microsoft_client_secret,
  callbackURL: config.microsoft_callback_url,
  scope: ['user.read'],
  tenant: 'common' // Cuentas Personales y Empresariales
}, async (accesToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || profile._json.mail || profile._json.userPrincipalName;
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
  } catch (err) {
    done(err, null);
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
