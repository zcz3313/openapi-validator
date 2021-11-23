const { truthy } = require('@stoplight/spectral-functions');
const { oas3 } = require('@stoplight/spectral-formats');

class ContentEntryContainsSchemaRule {
  static ruleName = 'content-entry-contains-schema';
  static rule = {
    description: 'Content entries must specify a schema',
    message: '{{description}}',
    formats: [oas3],
    given: [
      '$.paths[*].[post,put,patch].requestBody.content[*]',
      '$.paths[*].[get,post,put,patch,delete].[parameters,responses][*].content[*]'
    ],
    severity: 'warn',
    resolved: true,
    then: [
      {
        field: 'schema',
        function: truthy
      }
    ]
  };
}

module.exports = ContentEntryContainsSchemaRule;