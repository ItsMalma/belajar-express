const expressValidator = require("express-validator");

module.exports = {
  /**
   *
   * @param {expressValidator.ValidationError[]} validationErrors
   */
  convertValidatorErrors: function (validationErrors) {
    const errors = {};
    validationErrors.forEach(function (validationError) {
      if (!(validationError.param in errors))
        errors[validationError.param] = [];
      errors[validationError.param].push(validationError.msg);
    });
    return errors;
  },
};
