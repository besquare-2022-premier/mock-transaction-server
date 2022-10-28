const express = require("express");
const TransactionRequest = require("../types/request");
const { ResponseBase, NewSessionResponse } = require("../types/response");
const Session = require("../types/session");
const crypto = require("crypto");

/**
 * The session map for the server
 * @type{{[key:string]:Session}}
 */
let session_map = {};
async function randomID() {
  /**
   * @type {Buffer}
   */
  let bytes = await new Promise((resolve, reject) => {
    crypto.randomBytes(10, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
  return bytes.toString("hex");
}
//define a app
let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", "./src/views");
/**
 * Get all sessions for debug use
 */
app.get("/all", function (req, res) {
  res.json(session_map).end();
});
/**
 * Checkout page
 */
app.get("/checkout", function (req, res) {
  const { session_id } = req.query;
  if (!session_id) {
    res.status(400).end("No idea on what to do");
    return;
  }
  const session = session_map[session_id];
  if (!session) {
    res.status(404).end("Invalid id");
    return;
  }
  if (session_id === "TEST") {
    session.status = Session.Status.CREATED;
  }
  if (session.isFinallized) {
    res.status(400).end("Finalized tx. Nothing can do");
    return;
  }
  res.render("transaction_page", {
    ...session.request,
    session_id,
  });
});
//make a new session
app.put("/", async function (req, res) {
  if (!req.body) {
    res.status(400).json(new ResponseBase(100, "Missing payload")).end();
    return;
  }
  let parsedResponse = TransactionRequest.constructFromJson(req.body);
  if (!parsedResponse) {
    res.status(400).json(new ResponseBase(101, "Invalid payload")).end();
    return;
  }
  //random generate an id
  let id = await randomID();
  session_map[id] = new Session(parsedResponse);
  res.status(200).json(new NewSessionResponse(id)).end();
});
//get session status
app.get("/:id", function (req, res) {
  const id = req.params.id;
  const status = session_map[id];
  if (!status) {
    res.status(404).json(new ResponseBase(102, "Invalid session_id")).end();
    return;
  }
  res.status(200).json(status).end();
});
//tx operation
const operations_map = {
  APPROVE: Session.prototype.markSuccess,
  REJECT: Session.prototype.markFailed,
  CANCEL: Session.prototype.markCancelled,
};
app.post("/", function (req, res) {
  if (!req.body) {
    res.status(400).json(new ResponseBase(100, "Missing payload")).end();
    return;
  }
  const { session_id, operation } = req.body;
  if (!session_id || !operation) {
    res.status(400).json(new ResponseBase(100, "Missing payload")).end();
    return;
  }
  const session = session_map[session_id];
  /**
   * @type{Function}
   */
  const operation_fn = operations_map[operation];
  if (!session) {
    res.status(404).json(new ResponseBase(102, "Invalid session_id")).end();
    return;
  }
  if (session.isFinallized || !operation_fn) {
    res.status(400).json(new ResponseBase(103, "Invalid operation")).end();
    return;
  }
  //apply the operation onto the session
  operation_fn.call(session);
  //redirect the users
  res.redirect(301, session.request.return_url);
});
module.exports = { app, session_map };
