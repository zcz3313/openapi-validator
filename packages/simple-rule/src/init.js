const { oas3, oas2 } = require('@stoplight/spectral-formats');
const ExamplesNameContainsSpace = require('./rules/examples-name-contains-space.rule');
const ProhibitSummarySentenceStyleRule = require('./rules/prohibit-summary-sentence-style.rule');

module.exports = async function() {
  
  const rules = {
    formats: [oas3,  oas2],
    rules: {
      
    }
  };
  
  rules.rules[ExamplesNameContainsSpace.ruleName] = ExamplesNameContainsSpace.rule;
  rules.rules[ProhibitSummarySentenceStyleRule.ruleName] = ProhibitSummarySentenceStyleRule.rule;
  
};
