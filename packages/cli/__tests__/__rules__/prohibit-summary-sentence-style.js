const { oas3 } = require('@stoplight/spectral-formats');
const { pattern } = require('@stoplight/spectral-functions');

class ProhibitSummarySentenceStyle {
  static ruleName = 'prohibit-summary-sentence-style';
  static rule = {
    description: 'Summary should not have a trailing period',
    message: 'Summary should not have a trailing period',
    severity: 'warn',
    formats: [oas3],
    resolved: false,
    given: '$.paths[*][*].summary',
    then: {
      function: pattern,
      functionOptions: {
        notMatch: '\\.$'
      }
    }
  };
}

module.exports = ProhibitSummarySentenceStyle;
