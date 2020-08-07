"use strict"
const passport = require('passport');
const dbConn = require("../db/dbService");
const initialize = require('../passport-config');
const flash = require('express-flash');
const express = require("express");
const session = require('express-session');
let registerRouter = express.Router();
registerRouter.use(passport.initialize());
registerRouter.use(session({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

registerRouter.use(passport.session());
registerRouter.use(flash());

registerRouter.get('/', (req, res ) => {
    res.render('register.ejs');
});

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
            return resolve(res[0]);
        });
    });
}

initialize(
    passport, 
    email => getUserByEmail(email),
    id => getUserById(id),
    registerUser);

    
function passwordChecker (req, res, next) {
    if(req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Passwords mismatched.");
        return res.redirect('register');
    }
    next();
}
registerRouter.post('/', passwordChecker, passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: true
}));

function registerUser (user) {
    return new Promise((resolve, reject) => {
        dbConn.query('INSERT INTO ilearndb.users (email, password) VALUES (?,?) ',[ user.email, user.password ], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        })
    })  
}

module.exports = registerRouter;