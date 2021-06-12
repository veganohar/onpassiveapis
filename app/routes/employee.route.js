const controller = require("../controllers/employee.controller");
const {userMiddleware} = require("../middlewares")
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/employees/createEmployee",[userMiddleware.verifyToken], controller.createEmployee);
  app.get("/api/employees/getEmployees/:limit/:skip",[userMiddleware.verifyToken],controller.getEmployees);
  app.get("/api/employees/getEmployeeById/:eid",[userMiddleware.verifyToken],controller.getEmployeeById);
  app.delete("/api/employees/deleteEmployee/:eid",[userMiddleware.verifyToken],controller.deleteEmployee);
  app.put("/api/employees/updateEmployee",[userMiddleware.verifyToken],controller.updateEmployee);
  app.get("/api/employees/departmentCounts",[userMiddleware.verifyToken],controller.departmentCounts);
  app.get("/api/employees/getMasters",[userMiddleware.verifyToken],controller.getMasters);
};