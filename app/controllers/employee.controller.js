const db = require("../models");
const Employee = db.employee;
const dataConfig = require("../config/data.config");


exports.getMasters = (req,res)=>{
    let departments = dataConfig.departments;
    let locations = dataConfig.locations;
    res.status(200).send({
        departments:departments,
        locations:locations
    })
}

exports.insertEmployeeData = () => {
    let names = dataConfig.names;
    let titles = dataConfig.titles;
    let departments = dataConfig.departments;
    let locations = dataConfig.locations;
    let records = [];
    for (let i = 0; i < 200; i++) {
        let dept = departments[randomNumber(0, departments.length - 1)];
        let emp = {
            full_name: names[randomNumber(0, names.length - 1)] + " " + names[randomNumber(0, names.length - 1)],
            department: dept,
            job_title: titles[randomNumber(0, titles.length - 1)] + " " + dept,
            location: locations[randomNumber(0, locations.length - 1)],
            age: randomNumber(21, 60),
            salary: (randomNumber(200, 1000) * 1000)
        }
        records.push(emp);
    }

    Employee.create(records, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Employees data created");
        }
    })

}
randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
exports.createEmployee = (req, res) => {
    let data = req.body;
    let employee = new Employee();
    for (let p in data) {
        employee[p] = data[p];
    }
    employee.save((err, response) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(201).send({
            message: "Employee Created Successfully",
            data: response
        })
    })
}

exports.getEmployees = async (req, res) => {
    let l = req.params.limit;
    let s = req.params.skip;
    let q;
    if (req.query.search) {
        let st = req.query.search;
        let ql = [{ "full_name": new RegExp(st, "gi") },
        { "job_title": new RegExp(st, "gi") },
        { "department": new RegExp(st, "gi") },
        { "location": new RegExp(st, "gi") }];
        if(!isNaN(st)){
            ql.push({ "age": Number(st) });
            ql.push({ "salary": Number(st) });
        }
        q={$or: ql}
    }
    if(req.query.filter) {
        let qa = [];
        let obj = JSON.parse(req.query.filter);
        for(let p in obj){
            let o = {};
            o[p]=obj[p];
            qa.push(o)
        }
        q = {$and:qa} 
    }
    let rec_count = await Employee.countDocuments(q);
    Employee.find(q).sort("-createdOn").limit(Number(l)).skip(Number(s)).exec((err, employees) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        } 
        res.status(200).send({
            data: employees,
            rec_count:rec_count
        })
    })
}

exports.deleteEmployee = (req, res) => {
    Employee.deleteOne({ _id: req.params.eid }, (err, response) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(201).send({
            data: response,
            message: "Employee Deleted"
        })
    })
}

exports.updateEmployee = (req, res) => {
    Employee.updateOne({ _id: req.body.id }, req.body, (err, response) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(201).send({
            data: response,
            message: "Employee Updated"
        })
    })
}

exports.getEmployeeById = (req, res) => {
    Employee.findById(req.params.eid, (err, employee) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(201).send({
            data: employee
        })
    })
}

exports.departmentCounts = async (req, res) => {
    Employee.aggregate( [
        {  "$group": {
            "_id": "$department",
            "count": { "$sum": 1 }
        } },
        { "$sort": { "_id": 1 } },
        {  "$group": {
            "_id": null,
            "counts": {
                "$push": {
                    "k": "$_id",
                    "v": "$count"
                }
            }
        } },
        { "$replaceRoot": {
            "newRoot": { "$arrayToObject": "$counts" }
        } }    
    ], (err, response) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(response[0]);
    })

}

