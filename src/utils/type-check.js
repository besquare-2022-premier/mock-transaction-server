/**
 * Type checking utilities for verification
 */

/**
 * Test weather the object provided is a valid string
 * @param {any|string} o Object to test against
 * @param {boolean} allowEmpty consider empty string as a valid string. Default value is false
 *
 * @returns {boolean}
 */
function isString(o, allowEmpty = false) {
  if (typeof o !== "string") {
    return false;
  }
  return allowEmpty || !!o;
}

/**
 * Test weather the provided value is a value integer
 * @param {any|number} o Object to test against
 *
 * @returns {boolean}
 */
function isInteger(o) {
  if (typeof o !== "number") {
    return false;
  }
  return (o | 0) === o;
}

module.exports = { isString, isInteger };
