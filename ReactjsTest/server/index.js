const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mysqlyash333",
    database: "Organisation_employee_management"
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/api/fetchDeptInfo", (req, res) => {

    const sqlSelectQuery = "Select * from ddi_department_table";

    db.query(sqlSelectQuery, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            res.send({code: 'SUCCESS', deptInfo: result});
        }
    })
})

app.get("/api/fetchEmpInfo", (req, res) => {

    const sqlSelectQuery = "Select * from ddi_employee_table";

    db.query(sqlSelectQuery, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            res.send({code: 'SUCCESS', empInfo: result});
        }
    })
})

app.post("/api/insert", (req, res) => {

    const reqBody = req.body;
    const name = reqBody["name"];
    const emailId = reqBody["emailId"];
    const contactNo = reqBody["contactNo"];
    const address = reqBody["address"];
    const selectedDept = reqBody["selectedDept"];

    console.log(reqBody);

    const sqlInsertQuery = "Insert into ddi_employee_table (empName, empEmail, empContactNo, empAddress, empDept) values (?, ?, ?, ?, ?)";

    db.query(sqlInsertQuery, [name, emailId, contactNo, address, selectedDept], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
        }
    })
})

app.post("/api/delete", (req, res) => {

    const reqBody = req.body;
    const emailId = reqBody["emailId"];

    console.log(reqBody);

    const sqlInsertQuery = `Delete from ddi_employee_table where empEmail = '${emailId}'`;

    db.query(sqlInsertQuery, [emailId], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            res.send({code: 'SUCCESS'});
        }
    })
})


app.listen(3001, () => {
    console.log('Running on port 3001');
})