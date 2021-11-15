const { oas3, oas2 } = require('@stoplight/spectral-formats');
const ExamplesNameContainsSpace = require('./rules/examples-name-contains-space.rule');
const ProhibitSummarySentenceStyleRule = require('./rules/prohibit-summary-sentence-style.rule');

module.exports = async function() {
  
  const ruleset = {
    formats: [oas3],
    rules: {}
  };
  
  ruleset.rules[ExamplesNameContainsSpace.ruleName] = ExamplesNameContainsSpace.rule;
  ruleset.rules[ProhibitSummarySentenceStyleRule.ruleName] = ProhibitSummarySentenceStyleRule.rule;
  
  return ruleset;
};
