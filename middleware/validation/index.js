// Validation middleware for api requests to check validity of requests w.r.t content type, syntax etc.

const isValidStudent = require('./isValidStudent');
const isValidAccount = require('./isValidAccount');
const isValidPasswordReset = require('./isValidPasswordReset');

module.exports = {
    isValidStudent,
    isValidAccount,
    isValidPasswordReset
}