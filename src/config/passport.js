import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { query } from './db.js';

// 1. GOOGLE STRATEGY CONSTRUCTOR
if (process.env.GOOGLE_CLIENT_ID) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName || 'OAuth';
            const lastName = profile.name.familyName || 'User';

            // Check if user already exists via email match
            let userCheck = await query('SELECT id, email, is_admin FROM users WHERE email = $1;', [email]);
            
            if (userCheck.rows.length === 0) {
                // First time logging in? Auto-register them with a random password string lock hash
                const insertQuery = `
                    INSERT INTO users (email, password_hash, first_name, last_name)
                    VALUES ($1, 'OAUTH_LOCK_EXTERNAL_CREDENTIAL', $2, $3)
                    RETURNING id, email, is_admin;
                `;
                const newUser = await query(insertQuery, [email, firstName, lastName]);
                return done(null, newUser.rows[0]);
            }
            return done(null, userCheck.rows[0]);
        } catch (err) {
            return done(err, null);
        }
    }));
}

// 1. GITHUB STRATEGY CONSTRUCTOR
if (process.env.GITHUB_CLIENT_ID) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const firstName = profile.name.givenName || 'OAuth';
            const lastName = profile.name.familyName || 'User';

            // Check if user already exists via email match
            let userCheck = await query('SELECT id, email, is_admin FROM users WHERE email = $1;', [email]);
            
            if (userCheck.rows.length === 0) {
                // First time logging in? Auto-register them with a random password string lock hash
                const insertQuery = `
                    INSERT INTO users (email, password_hash, first_name, last_name)
                    VALUES ($1, 'OAUTH_LOCK_EXTERNAL_CREDENTIAL', $2, $3)
                    RETURNING id, email, is_admin;
                `;
                const newUser = await query(insertQuery, [email, firstName, lastName]);
                return done(null, newUser.rows[0]);
            }
            return done(null, userCheck.rows[0]);
        } catch (err) {
            return done(err, null);
        }
    }));
}

export default passport;
