/**
 * Test suite on the session management
 */
const application = require("../src/index.js");
const request = require("supertest");
const TransactionRequest = require("../src/types/request.js");
const { isString } = require("../src/utils/type-check.js");
const { finalizeTransaction, expectSessionState } = require("./test_utils.js");
describe("Transaction session management", () => {
  let session_id;
  it("The transaction should be able to be created", async function () {
    //make a request
    const tx_request = new TransactionRequest(
      "Backend",
      1000,
      "MYR",
      "https://ops-test.merch-paradise.xyz/"
    );
    const res = await request(application)
      .put("/session")
      .send(tx_request)
      .set("Content-Type", "application/json")
      .accept("application/json")
      .expect(200);
    expect(isString(res.body.session_id)).toStrictEqual(true);
    session_id = res.body.session_id;
  });
  it("The transaction created shall be in the created state initially", async function () {
    await expectSessionState(application, session_id, "CREATED");
  });
  it("The tx control should have effect", async function () {
    //first step is to approve the transaction
    const ops = "APPROVE";
    await finalizeTransaction(
      application,
      session_id,
      ops,
      "https://ops-test.merch-paradise.xyz/"
    );
    //check the status
    await expectSessionState(application, session_id, "SUCCEEDED");
  });
  it("The tx enumuration endpoint shall show all txs", async function () {
    const res = await request(application)
      .get("/session/all")
      .accept("application/json")
      .expect(200);
    expect(res.body[session_id]).toBeTruthy();
  });
});
