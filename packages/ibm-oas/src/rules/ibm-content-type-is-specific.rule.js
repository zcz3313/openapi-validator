const { oas3 } = require('@stoplight/spectral-formats');
const { falsy } = require('@stoplight/spectral-functions');

class IbmContentTypeIsSpecificRule {
  static ruleName = 'ibm-content-type-is-specific';
  static rule = {
    description: '*/* should only be used when all content types are supported',
    formats: [oas3],
    severity: 'warn',
    resolved: true,
    message: '{{description}}',
    given: [
      '$.paths[*][*][parameters,responses][*].content',
      '$.paths[*][*][requestBody].content'
    ],
    then: {
      field: '*/*',
      function: falsy
    }
  };
}

module.exports = IbmContentTypeIsSpecificRule;