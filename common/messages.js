function messages(req, res, next){
    res.locals.message = "";
    next();
}

module.exports = messages;