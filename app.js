const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

const filter = (param, res) => {
    let filter = `select * from employees where name like '%${param}%' or surnames like '%${param}%' or identification_card like '%${param}%'`;

    connection.query(filter, (err, results)=> {
        err ? res.json({message: 'Query error', error: err}) : res.json(results);
    })
}

// Get all employes
app.get('/employees', (req, res) => {
    let param = req.headers.look;
    const query = 'select * from employees';

    if(param != '' && param != undefined) filter(param, res)
    else {
        connection.query(query, (err, results)=> {
            err ? res.json({message: 'Query error', error: err}) : res.json(results);
        })
    }
})

//Get a employee by id
app.get('/employees/:id', (req, res) => {
    let id = req.params.id;
    let query = `select * from employees where id = ${id}`;

    connection.query(query, (err, result) => {
        err ? res.json({message: 'Query error', error: err}) : res.json(result);
    })
})

//New employee
app.post('/new-employee', (req, res) => {
    const query = 'insert into employees set ?'
    let newEmployee = {
        name: req.body.name,
        surnames: req.body.surnames,
        identification_card: req.body.identification_card
    } 

    connection.query(query, newEmployee, err => {
        err ? res.json({message: 'Error', error: err}) :  res.json({message: 'Success'});
    })
})

//Update a employee
app.put('/update-employee/:id', (req, res) => {
    let id = req.params.id;
    let {name, surnames, identification_card} = req.body;

    let query = `update employees set name = '${name}', surnames = '${surnames}', identification_card = '${identification_card}' where id = ${id}`;

    connection.query(query, err => {
        err ? res.json({message: 'Error', error: err}) :  res.json({message: 'Success'});
    })
})

//Delete a employee
app.delete('/delete-employee/:id', (req, res) => {
    let id = req.params.id;
    let query = `delete from employees where id = ${id}`;

    connection.query(query, err => {
        err ? res.json({message: 'Error', error: err}) :  res.json({message: 'Success'});
    })
})

// //mysql connection
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// });

// //connect mysql
// connection.connect(err => {
//     if(err) throw('Connection error', err)
//     else console.log('Connection success!');
// })

const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } else console.log('Connection success!'); // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));