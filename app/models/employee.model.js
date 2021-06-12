const mongoose = require("mongoose");

const Employee = mongoose.model(
    "Employee",
    new mongoose.Schema({
        full_name: {
            type: String,
            required: true
        },
        job_title: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        salary: {
            type: Number,
            required: true,
        },
        createdOn: {
            type: Date,
            default: Date.now
        }
    })
);

module.exports = Employee;