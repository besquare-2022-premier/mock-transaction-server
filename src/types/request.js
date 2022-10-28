const type_check = require("../utils/type-check");
/**
 * The transaction request
 */
class TransactionRequest {
  /**
   * Construct a transaction request
   *
   * @param {string} vendor The vendor whos receive the payment
   * @param {number} amount The amount of the transaction
   * @param {"MYR"} currency The currency the amount is in. Only MYR is accepted
   * @param {string} return_url The return URL
   *
   */
  constructor(vendor, amount, currency, return_url) {
    this.vendor = vendor;
    this.amount = amount;
    this.currency = currency;
    this.return_url = return_url;
  }
  /**
   * Construct the object from the normal JSON object
   *
   * @param {any} object A object to construct the object from
   *
   * @returns {TransactionRequest|null} The object or null when the validation failed
   */
  static constructFromJson(object) {
    if (!type_check.isString(object.vendor)) {
      return null;
    }
    if (!type_check.isInteger(object.amount)) {
      return null;
    }
    if (object.currency !== "MYR") {
      return null;
    }
    if (type_check.isString(object.return_url)) {
      return null;
    }
    return new TransactionRequest(
      object.vendor,
      object.amount,
      object.currency,
      object.return_url
    );
  }
}

module.exports = TransactionRequest;
