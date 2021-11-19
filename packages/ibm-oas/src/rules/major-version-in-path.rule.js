const { oas2, oas3 } = require('@stoplight/spectral-formats');
const check_major_version = require('../functions/check_major_version');

class MajorVersionInPathRule {
  static ruleName = 'major-version-in-path';
  static rule = {
    description: 'All paths must contain the API major version as a distinct path segment',
    message: '{{error}}',
    formats: [oas2, oas3],
    given: ['$'],
    severity: 'warn',
    then: {
      function: check_major_version
    }
  };
}

module.exports = MajorVersionInPathRule;