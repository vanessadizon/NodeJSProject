if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const passport = require('passport');
const dbConn = require("../db/dbService");
const initialize = require('../passport-config');
const flash = require('express-flash');
const express = require("express");
const session = require('express-session');
let loginRouter = express.Router();
loginRouter.use(passport.initialize());
loginRouter.use(passport.session());
loginRouter.use(flash());

loginRouter.use(session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        dbConn.query('SELECT * FROM users where email = ?', email, (err, res) => {
            if(err) { return reject(err); }
            return resolve(res[0]);
        });
    });
}

const getUserById = (id) => { 
    return new Promise((resolve, reject) => {
        dbConn.query('SELECT * FROM users where idusers = ?', id, (err, res) => {
            if(err) { return reject(err); }
            return resolve(res);
        });
    });
}

initialize(
    passport, 
    email => getUserByEmail(email),
    id => getUserById(id),
    null);

loginRouter.get('/', (req, res ) => {
    return res.render('login.ejs');
});

loginRouter.post('/', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = loginRouter;