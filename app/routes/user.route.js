const controller = require("../controllers/user.controller");
const {userMiddleware} = require("../middlewares")
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/users/signup",[userMiddleware.checkDuplicateUsername], controller.signup);
  app.post("/api/users/signin",controller.signin);
  app.get("/api/users/forgetpw/:uname",controller.forgetpw);
  app.put("/api/users/resetpw",[userMiddleware.verifyToken,userMiddleware.pwresetvalidate],controller.resetpw);
};