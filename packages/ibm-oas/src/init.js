const { oas3, oas2 } = require('@stoplight/spectral-formats');
const ExamplesNameContainsSpace = require('./rules/examples-name-contains-space.rule');
const ProhibitSummarySentenceStyleRule = require('./rules/prohibit-summary-sentence-style.rule');

module.exports = async function() {
  
  const rules = {
  };
  
  rules[ExamplesNameContainsSpace.ruleName] = ExamplesNameContainsSpace.rule;
  rules[ProhibitSummarySentenceStyleRule.ruleName] = ProhibitSummarySentenceStyleRule.rule;
  
  return rules;
};
