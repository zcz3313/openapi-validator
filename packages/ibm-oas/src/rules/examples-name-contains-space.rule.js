const { pattern } = require('@stoplight/spectral-functions');
const { oas3 } = require('@stoplight/spectral-formats');

class ExamplesNameContainsSpaceRule{
  static ruleName = "examples-name-contains-space";
  static rule = {
    description: "Examples name should not contain space",
    message: "Examples name should not contain space",
    severity: "warn",
    resolved: false,
    formats: [oas3],
    given: "$.paths[*][*].responses[*][*][*].examples[*]~",
    then: {
      function: pattern,
      functionOptions:{
        notMatch: '^(.*\s+.*)+$'
      }
    }
  }
}

module.exports = ExamplesNameContainsSpaceRule