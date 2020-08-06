const express = require("express");
const methodOverride = require("method-override");

let indexRouter = express.Router();
indexRouter.use(methodOverride('_method'));

indexRouter.get('/', (req , res ) => {
    res.render('index.ejs');
});

indexRouter.delete('/logout', (req, res ) => {
    req.logOut();
    res.redirect('/login');
});

module.exports = indexRouter;