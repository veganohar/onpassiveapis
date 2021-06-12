const express = require("express");
const app = express();
const PORT = 3000;
const dbConfig = require("./app/config/db.config");
const db = require("./app/models");
const bodyParser = require("body-parser");
const cors = require("cors");
const Employee = db.employee;
const employeeController =  require("./app/controllers/employee.controller");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    res.send("Welcome");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Successfully connect to MongoDB.");
        Employee.countDocuments((err, count) => {
            if (count <= 0) {
                employeeController.insertEmployeeData(); 
            } 
        })
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });


require("./app/routes/user.route")(app);
require("./app/routes/employee.route")(app);
