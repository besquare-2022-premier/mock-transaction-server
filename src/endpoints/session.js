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
//define a router
let app = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
 * Get all sessions for debug use
 */
app.get("/all", function (req, res) {
  res.json(session_map).end();
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
  res.redirect(301, session.request.return_url).end();
});
module.exports = app;
