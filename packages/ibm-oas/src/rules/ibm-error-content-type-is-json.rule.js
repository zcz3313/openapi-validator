const { oas3 } = require('@stoplight/spectral-formats');
const { truthy } = require('@stoplight/spectral-functions');

class IbmErrorContentTypeIsJsonRule {
  
  static ruleName = 'ibm-error-content-type-is-json';
  static rule = {
    description: 'error response should support application/json',
    formats: [oas3],
    severity: 'warn',
    resolved: true,
    message: '{{description}}',
    given: [
      '$.paths[*][*].responses[?(@property >= 400 && @property < 600)].content'
    ],
    then: {
      field: 'application/json',
      function: truthy
    }
    
  };
}

module.exports = IbmErrorContentTypeIsJsonRule;