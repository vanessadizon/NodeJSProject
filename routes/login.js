if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require("express");
let loginRouter = express.Router();
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const initialize = require('../passport-config');
const dbConn = require("../db/dbService");
const messages = require("../common/messages");

const getUserByEmail = (email) => {
    console.log('email ' + email);
    return new Promise((resolve, reject) => {
        dbConn.query('SELECT * FROM users where email = ?', email, (err, res) => {
            if(err) { return reject(err); }
            console.log('res email ' + res);
            return resolve(res);
        });
    });
}

const getUserById = (id) => { 
    return new Promise((resolve, reject) => {
        dbConn.query('SELECT * FROM users where id = ?', id, (err, res) => {
            if(err) { return reject(err); }
            console.log('res id ' + res);
            return resolve(res);
        });
    });
}

initialize(
    passport, 
    email => getUserByEmail(email),
    id => getUserById(id));

loginRouter.use(session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

loginRouter.use(passport.initialize());
loginRouter.use(passport.session());
loginRouter.use(flash());

loginRouter.get('/', messages, (req, res ) => {
    return res.render('login.ejs');
});

loginRouter.post('/', messages, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

function authenticateToken(req, res, next ) {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if(token == null) {
    //     return res.sendStatus(401);
    // }

    // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    //     if(err) {
    //         return res.sendStatus(403);
    //     }
    //     req.user = user;
    //     next();
    // })
}

module.exports = loginRouter;