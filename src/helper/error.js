const expressValidator = require("express-validator");

module.exports = {
  /**
   *
   * @param {expressValidator.ValidationError[]} validationErrors
   */
  convertValidatorErrors: function (validationErrors) {
    const errors = {};
    validationErrors.forEach(function (validationError) {
      errors[validationError.param] = validationError.msg;
    });
    return errors;
  },
};
