const spectralRulesets = require('@stoplight/spectral-rulesets');
const spectralFunctions = require('@stoplight/spectral-functions');
const {oas3} = require('@stoplight/spectral-formats');

class Ruleset {
  formats = [oas3];
  extends = [spectralRulesets.oas];
  rules = {
    "simple-rule": {
      given: "$.info",
      then: {
        function: () => {
          console.log("simple-rule has been called!")
        }
      }
    }
  };
}

module.exports = Ruleset;