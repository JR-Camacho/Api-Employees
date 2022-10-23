const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3050;

const app = express();

let whiteList = ['http://localhost:4200', 'https://employeesregister.netlify.app'];

let corsOptions = {
    origin : (origin, callback) => {
        if(whiteList.indexOf(origin) != -1) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    }
}

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
app.get('/employees', cors(corsOptions), (req, res) => {
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
app.get('/employees/:id',cors(corsOptions), (req, res) => {
    let id = req.params.id;
    let query = `select * from employees where id = ${id}`;

    connection.query(query, (err, result) => {
        err ? res.json({message: 'Query error', error: err}) : res.json(result);
    })
})

//New employee
app.post('/new-employee',cors(corsOptions), (req, res) => {
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
app.put('/update-employee/:id',cors(corsOptions), (req, res) => {
    let id = req.params.id;
    let {name, surnames, identification_card} = req.body;

    let query = `update employees set name = '${name}', surnames = '${surnames}', identification_card = '${identification_card}' where id = ${id}`;

    connection.query(query, err => {
        err ? res.json({message: 'Error', error: err}) :  res.json({message: 'Success'});
    })
})

//Delete a employee
app.delete('/delete-employee/:id',cors(corsOptions), (req, res) => {
    let id = req.params.id;
    let query = `delete from employees where id = ${id}`;

    connection.query(query, err => {
        err ? res.json({message: 'Error', error: err}) :  res.json({message: 'Success'});
    })
})

//mysql connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//connect mysql
connection.connect(err => {
    if(err) throw('Connection error', err)
    else console.log('Connection success!');
})

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));