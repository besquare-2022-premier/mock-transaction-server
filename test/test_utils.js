const request = require("supertest");
const Session = require("../src/types/session");
module.exports = {
  /**
   * @param {Express.Application} app
   * @param {string} session_id
   * @param {"APPROVE"|"REJECT"|"CANCEL"} ops
   * @param {string} return_url
   */
  finalizeTransaction: async function (app, session_id, ops, return_url) {
    const res = await request(app)
      .post("/session/")
      .send(`session_id=${session_id}&operation=${ops}`)
      .expect(301);
    expect(res.get("Location")).toStrictEqual(return_url);
  },
  /**
   * @param {Express.Application} app
   * @param {string} session_id
   * @param {keyof Session.Status} status
   */
  expectSessionState: async function (app, session_id, status) {
    const res = await request(app)
      .get(`/session/${session_id}`)
      .accept("application/json")
      .expect(200);
    expect(res.body.status).toStrictEqual(status);
  },
};
