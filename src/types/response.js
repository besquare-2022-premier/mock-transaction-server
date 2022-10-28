/**
 * Base type of all non-paginated responses
 * Not apply for the direct object access request
 */
class ResponseBase {
  /**
   * Construct a response
   * @param {number} status
   * @param {string} message
   */
  constructor(status = 0, message = "OK") {
    this.status = status;
    this.message = message;
  }
}

/**
 * Response type when a new session is created
 */
class NewSessionResponse extends ResponseBase {
  /**
   * @param {string} session_id
   */
  constructor(session_id) {
    super();
    this.session_id = session_id;
  }
}

module.exports = { ResponseBase, NewSessionResponse };
