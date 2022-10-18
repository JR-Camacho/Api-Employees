const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const { get } = require('mongoose');
if(process.env.NODE_ENV != 'production') require('dotenv').config();

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

const firter = (param, res) => {
    let firter = `select * from employees where name like '%${param}%' or surnames like '%${param}%' or identification_card like '%${param}%'`;

    connection.query(firter, (err, results)=> {
        err ? res.json({message: 'Query error', error: err}) : res.json(results);
    })
}

// Get all employes
app.get('/employees', (req, res) => {
    let param = req.headers.look;
    const query = 'select * from employees';

    if(param != '' && param != undefined) firter(param, res)
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

//mysql connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

//connect mysql
connection.connect(err => {
    if(err) throw('Connection error', err)
    else console.log('Connection success!');
})

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));