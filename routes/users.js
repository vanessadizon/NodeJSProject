"use strict"
const express = require("express");
const Joi = require('joi');

let userRouter = express.Router();

const users = [
    {id:1, name:'Vanessa'},
    {id:2, name:'Jhong'},
    {id:3, name:'Jef'}
]

userRouter.route('/')
    .get((req, res) => {
        res.send(users);
    })
    .post((req, res) => {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const user = {
            id: users.length + 1,
            name: req.body.name
        };
        
        users.push(user);
        res.send(user);
    });

userRouter.route('/:id')
    .put((req, res) => {
        const user = users.find(user => user.id === parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).send('User id does not exist...');
        }

        const { error } = validateUser(req.body);

        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }

        user.name = req.body.name;
        res.send(user);
    })
    .delete((req, res) => {
        const user = users.find(user => user.id === parseInt(req.params.id));
        
        if (!user) {
            return res.status(404).send(`The user with the ID : ${req.params.id} was not found...`);
        }
        const userIndexToDelete = users.indexOf(user);
        users.splice(userIndexToDelete, 1);
        return res.send(users);
    });

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    return schema.validate(user);
}

module.exports = userRouter;