const session_app = require("./endpoints/session");
const TransactionRequest = require("./types/request");
const Session = require("./types/session");

const application = require("express")();

application.get("/", function (req, res) {
  res.write("Hurray");
  res.end();
});
application.use("/session", session_app.app);

//generate one session if TEST is set
if (process.env.TEST) {
  session_app.session_map["TEST"] = new Session(
    new TransactionRequest("Backend", 2000, "MYR", "/")
  );
  console.log("Use session_id=TEST to test the pages");
}

if (process.env.JEST_WORKER_ID) {
  //export the application as a module when it is being tested
  module.exports = application;
} else {
  //otherwise run it as nodejs application
  const PORT = process.env.PORT || 8080;
  application.listen(PORT);
  console.log(`Listening on port ${PORT}`);
}
