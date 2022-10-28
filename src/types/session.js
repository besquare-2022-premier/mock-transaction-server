const TransactionRequest = require("./request");

/**
 * The statuses for the session
 */
const SessionStatus = Object.freeze({
  /**
   * The session is just created
   */
  CREATED: Symbol("CREATED"),
  /**
   * The transaction processing for this session is finalized with success
   */
  SUCCEEDED: Symbol("SUCCEEDED"),
  /**
   * The transaction processing for this session is failed
   */
  FAILED: Symbol("FAILED"),
  /**
   * The session is ended by user (transaction is cancelled)
   */
  CANCELLED: Symbol("CANCELLED"),
});
/**
 * The session object
 */
class Session {
  /**
   * Create a session based on the transaction object
   * @param {TransactionRequest} request The transaction request
   */
  constructor(request) {
    this.request = request;
    this.status = SessionStatus.CREATED;
  }
  /**
   * Check weather is the session is finalized
   */
  get isFinallized() {
    return this.status !== SessionStatus.CANCELLED;
  }
  #assertNotFinalized() {
    if (!this.isFinallized()) {
      throw new Error("Cannot update the finalized session");
    }
  }
  markCancelled() {
    this.#assertNotFinalized();
    this.status = SessionStatus.CANCELLED;
  }
  markFailed() {
    this.#assertNotFinalized();
    this.status = SessionStatus.FAILED;
  }
  markSuccess() {
    this.#assertNotFinalized();
    this.status = SessionStatus.SUCCEEDED;
  }
}
/**
 * The statuses for the session
 * @enum {SessionStatus}
 */
Session.Status = SessionStatus;
module.exports = Session;
