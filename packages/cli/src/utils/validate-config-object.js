const defaultsForValidator = require('./../.defaultsForValidator');

const validateConfigOption = function(userOption, defaultOption) {
  const result = { valid: true };
  // determine what type of option it is
  let optionType;
  Object.keys(defaultsForValidator.options).forEach(option => {
    if (defaultsForValidator.options[option].includes(defaultOption)) {
      optionType = option;
    }
  });
  // if optionType doesn't match, there are no predefined options for this rule
  if (!optionType) {
    return result;
  }
  // verify the given option is valid
  const validOptions = defaultsForValidator.options[optionType];
  if (!validOptions.includes(userOption)) {
    result.valid = false;
    result.options = validOptions;
  }

  return result;
};

const validateConfigObject = function(configObject) {
  const configErrors = [];
  let validObject = true;

  const deprecatedRules = Object.keys(defaultsForValidator.deprecated);

  const allowedSpecs = Object.keys(defaultsForValidator.defaults);
  const userSpecs = Object.keys(configObject);
  userSpecs.forEach(spec => {
    // Do not check "spectral" spec rules
    if (spec === 'spectral') {
      return;
    }
    if (!allowedSpecs.includes(spec)) {
      validObject = false;
      configErrors.push({
        message: `'${spec}' is not a valid spec.`,
        correction: `Valid specs are: ${allowedSpecs.join(', ')}`
      });
      return; // skip rules for categories for invalid spec
    }

    // check that all categories are valid
    const allowedCategories = Object.keys(defaultsForValidator.defaults[spec]);
    const userCategories = Object.keys(configObject[spec]);
    userCategories.forEach(category => {
      if (!allowedCategories.includes(category)) {
        validObject = false;
        configErrors.push({
          message: `'${category}' is not a valid category.`,
          correction: `Valid categories are: ${allowedCategories.join(', ')}`
        });
        return; // skip rules for invalid category
      }

      // check that all rules are valid
      const allowedRules = Object.keys(defaultsForValidator[spec][category]);
      const userRules = Object.keys(configObject[spec][category]);
      userRules.forEach(rule => {
        if (
          deprecatedRules.includes(rule) ||
          // account for rules with same name in different categories
          deprecatedRules.includes(`${category}.${rule}`)
        ) {
          const oldRule = deprecatedRules.includes(rule)
            ? rule
            : `${category}.${rule}`;

          const newRule = defaultsForValidator.deprecated[oldRule];
          const message =
            newRule === ''
              ? `The rule '${oldRule}' has been deprecated. It will not be checked.`
              : `The rule '${oldRule}' has been deprecated. It will not be checked. Use '${newRule}' instead.`;
          console.log('\n [Warning] ' + message);
          delete configObject[spec][category][rule];
          return;
        } else if (!allowedRules.includes(rule)) {
          validObject = false;
          configErrors.push({
            message: `'${rule}' is not a valid rule for the ${category} category`,
            correction: `Valid rules are: ${allowedRules.join(', ')}`
          });
          return; // skip statuses for invalid rule
        }

        // check that all statuses are valid (either 'error', 'warning', 'info', 'hint' or 'off')
        const allowedStatusValues = ['error', 'warning', 'info', 'hint', 'off'];
        let userStatus = configObject[spec][category][rule];

        // if the rule supports an array in configuration,
        // it will be an array in the defaults object
        const defaultStatus = defaultsForValidator[spec][category][rule];
        const ruleTakesArray = Array.isArray(defaultStatus);
        const userGaveArray = Array.isArray(userStatus);

        if (ruleTakesArray) {
          const userStatusArray = userGaveArray ? userStatus : [userStatus];
          userStatus = userStatusArray[0] || '';
          const configOption = userStatusArray[1] || defaultStatus[1];
          if (configOption !== defaultStatus[1]) {
            const result = validateConfigOption(configOption, defaultStatus[1]);
            if (!result.valid) {
              configErrors.push({
                message: `'${configOption}' is not a valid option for the ${rule} rule in the ${category} category.`,
                correction: `Valid options are: ${result.options.join(', ')}`
              });
              validObject = false;
            }
          }
          configObject[spec][category][rule] = [userStatus, configOption];
        } else if (userGaveArray) {
          // user should not have given an array
          validObject = false;
          // dont throw two errors
          userStatus = 'off';
          configErrors.push({
            message: `Array-value configuration options are not supported for the ${rule} rule in the ${category} category.`,
            correction: `Valid statuses are: ${allowedStatusValues.join(', ')}`
          });
        }
        if (!allowedStatusValues.includes(userStatus)) {
          validObject = false;
          configErrors.push({
            message: `'${userStatus}' is not a valid status for the ${rule} rule in the ${category} category.`,
            correction: `Valid statuses are: ${allowedStatusValues.join(', ')}`
          });
        }
      });
    });
  });

  // if the object is valid, resolve any missing features
  //   and set all missing statuses to their default value
  if (validObject) {
    const requiredSpecs = allowedSpecs;
    requiredSpecs.forEach(spec => {
      if (!userSpecs.includes(spec)) {
        configObject[spec] = {};
      }
      const requiredCategories = Object.keys(defaultsForValidator[spec]);
      const userCategories = Object.keys(configObject[spec]);
      requiredCategories.forEach(category => {
        if (!userCategories.includes(category)) {
          configObject[spec][category] = {};
        }
        const requiredRules = Object.keys(defaultsForValidator[spec][category]);
        const userRules = Object.keys(configObject[spec][category]);
        requiredRules.forEach(rule => {
          if (!userRules.includes(rule)) {
            configObject[spec][category][rule] =
              defaultsForValidator[spec][category][rule];
          }
        });
      });
    });
    configObject.invalid = false;
  } else {
    // if the object is not valid, exit and tell the user why
    // printConfigErrors(configErrors, chalk, '.validaterc');

    configObject.errors = configErrors;
    configObject.invalid = true;
  }

  return configObject;
};

module.exports.validateConfigObject = validateConfigObject;
module.exports.validateConfigOption = validateConfigOption;
