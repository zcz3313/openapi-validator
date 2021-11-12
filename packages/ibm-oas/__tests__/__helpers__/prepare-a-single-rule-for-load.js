const {oas3, oas2, oas3_1} = require("@stoplight/spectral-formats");

function prepareASingleRuleForLoad(rule) {
  const ruleSet = {
    formats: [oas3, oas2, oas3_1],
    rules: {}
  };
  ruleSet.rules[rule.ruleName] = rule.rule;

  return ruleSet;
}

module.exports = prepareASingleRuleForLoad;