
const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "ilearndb"
});

dbConn.connect((err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('db ' + dbConn.state);
})

module.exports = dbConn;