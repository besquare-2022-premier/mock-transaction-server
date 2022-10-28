/**
 * Session matrix testing file
 * Test all the state changes
 */
const application = require("../src/index.js");
const request = require("supertest");
const TransactionRequest = require("../src/types/request.js");
const { isString } = require("../src/utils/type-check.js");
const { finalizeTransaction, expectSessionState } = require("./test_utils.js");
const knownStates = {
  APPROVE: "SUCCEEDED",
  REJECT: "FAILED",
  CANCEL: "CANCELLED",
};
describe("Transaction state transition matrix test", () => {
  for (const ops of Object.keys(knownStates)) {
    it(`${ops} should succeeded`, async function () {
      //make a request
      const tx_request = new TransactionRequest(
        "Backend",
        1000,
        "MYR",
        "http://ops-test.merch-paradise.xyz"
      );
      const res = await request(application)
        .put("/session")
        .send(tx_request)
        .set("Content-Type", "application/json")
        .accept("application/json")
        .expect(200);
      expect(isString(res.body.session_id)).toStrictEqual(true);
      let session_id = res.body.session_id;
      await expectSessionState(application, session_id, ops);
      await finalizeTransaction(
        application,
        session_id,
        ops,
        "http://ops-test.merch-paradise.xyz/commit"
      );
      //check the status
      await expectSessionState(application, session_id, knownStates[ops]);
    });
  }
});
