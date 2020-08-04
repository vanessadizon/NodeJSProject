"use strict"
const express = require("express");
const bcrypt = require("bcrypt");
const dbConn = require("../db/dbService");

let registerRouter = express.Router();

function messages(req,res,next){
    res.locals.message = "";
    next();
}

registerRouter.get('/', messages, (req, res ) => {
    res.render('register.ejs');
});

registerRouter.post('/', async (req, res ) => {
    try {
        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);
        const user = { email: email, 
                        password: password };
        checkUserIfAlreadyExist(user)
            .then((is_user_exist) => { 
                console.log(is_user_exist);
                if (is_user_exist === 1) {
                    console.log("is_user_exist");
                    res.locals.message = 'Email already exists.';
                    res.redirect('register.ejs');
                }
            })
            .catch(err => console.log(err));

        registerUser(user)
            .then(res.redirect('/login'))
            .catch(err => console.log(err));
        
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

const checkUserIfAlreadyExist = (user) => {
    return new Promise((resolve, reject) => {
        dbConn.query('SELECT EXISTS(SELECT * FROM users where email = ?) AS is_user_exist', user.email, (err, res) => {
            if(err) { return reject(err); }
            return resolve(res[0].is_user_exist);
        });
    });
}

function registerUser (user) {
    return new Promise((resolve, reject) => {
        dbConn.query('INSERT INTO ilearndb.users (email, password) VALUES (?,?) ',[ user.email, user.password ], (err, res) => {
            if(err) return reject(err);
            return resolve(res);
        })
    })  
}

module.exports = registerRouter;