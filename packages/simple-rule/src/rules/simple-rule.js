import { oasRuleset } from '@stoplight/spectral-rulesets';
import { truthy } from '@stoplight/spectral-functions';

export default {
  formats: [oas3],
  extends: [oasRuleset],
  rules: {
    "simple-rule":{
      given: "$.info",
      then: {
        function: () => {
          console.log("simple-rule has been called!")
        }
      }
    }
  }
}