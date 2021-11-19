const { oas3 } = require('@stoplight/spectral-formats');
const { truthy } = require('@stoplight/spectral-functions');

class ServerVariableDefaultValueRule {
  static ruleName = 'server-variable-default-value';
  static rule = {
    description: 'Server variable should have default value',
    message: '{{description}}',
    severity: 'warn',
    resolved: false,
    formats: [oas3],
    given: [
      '$.servers[*][variables][*][default]'
    ],
    then: {
      function: truthy
    }
  };
}

module.exports = ServerVariableDefaultValueRule;