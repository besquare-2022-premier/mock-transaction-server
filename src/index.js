const session_app = require("./endpoints/session");

const application = require("express")();

application.get("/", function (req, res) {
  res.write("Hurray");
  res.end();
});
application.use("/session", session_app.app);

if (process.env.JEST_WORKER_ID) {
  //export the application as a module when it is being tested
  module.exports = application;
} else {
  //otherwise run it as nodejs application
  const PORT = process.env.PORT || 8080;
  application.listen(PORT);
  console.log(`Listening on port ${PORT}`);
}
