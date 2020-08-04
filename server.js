const express = require('express');

const server = express();
const users = require("./routes/users");
const login = require("./routes/login");
const register = require("./routes/register");
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use("/users", users);
server.use("/login", login);
server.use("/register", register);
server.use('/static', express.static(path.join(__dirname, 'public')))

server.set('views', path.join(__dirname, 'views'));
server.set('view-engine', 'ejs');

const port = 3000 || process.env.port;

server.listen(port, () => { console.log(`Listening on port ${port}...`)});