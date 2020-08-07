const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById, registerUser) {
    const authenticateUserAsync = async (email, password, done) => {
        const user = await getUserByEmail(email);

        if(user === undefined) {
            return done(null, false, { message: 'No user with that email'});
        }

        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect'});
            }
        } catch (e) {
            return done(e);
        }
    }
    const registerUserAsync = async (email, password, done) => {
        const userByEmail = await getUserByEmail(email);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email: email, password: hashedPassword };

        try {
            if(userByEmail === undefined) {
                const registedInfo = await registerUser(newUser);
                const newlyAddedUser = await getUserById(registedInfo.insertId);
                return done(null, newlyAddedUser);
            }
            return done(null, false, { message: 'User already exists.'});
        } catch (e) {
            return done(e);
        }
    }
    passport.use('login', new LocalStrategy({usernameField: 'email', passwordField: 'password' }, authenticateUserAsync));
    passport.use('register', new LocalStrategy({usernameField: 'email', passwordField: 'password' }, registerUserAsync));
    passport.serializeUser((user, done) => done(null, user.idusers));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize;