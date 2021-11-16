const MessageCarrier = require('../../plugins/utils/messageCarrier');
const config = require('../../cli-validator/utils/processConfiguration');
const ibmOas3Ruleset = require('@acsanyi-test/ibm-oas');
const fs = require('fs');
const path = require('path');
const stoplightPath = require('@stoplight/path');
const { mergeRulesets } = require('@stoplight/spectral-core/dist/ruleset/mergers/rulesets');
const { bundleRuleset } = require('@stoplight/spectral-ruleset-bundler');
const { fetch } = require('@stoplight/spectral-runtime');
const chalk = require('chalk');
const { stdin } = require('@stoplight/spectral-ruleset-bundler/dist/plugins/stdin');
const { builtins } = require('@stoplight/spectral-ruleset-bundler/dist/plugins/builtins');
const rollUp = require('@rollup/plugin-commonjs');
const { node } = require('@stoplight/spectral-ruleset-bundler/dist/presets/node');
const { createRequire } = require('module');
const { isObject } = require('lodash/lang');
const { Ruleset, Spectral } = require('@stoplight/spectral-core'); 
// default spectral ruleset file
// const defaultSpectralRulesetURI =
//   __dirname + '/../rulesets/.defaultsForSpectral.yaml';

const parseResults = function(results, debug) {
  const messages = new MessageCarrier();
  
  if (results) {
    for (const validationResult of results) {
      if (validationResult) {
        const code = validationResult['code'];
        const severity = validationResult['severity'];
        const message = validationResult['message'];
        const path = validationResult['path'];
        
        if (code === 'parser') {
          // Spectral doesn't allow disabling parser rules, so don't include them
          // in the output (for now)
          continue;
        }
        
        if (typeof severity === 'number' && code && message && path) {
          if (severity === 0) {
            // error
            messages.addMessage(path, message, 'error', code);
          } else if (severity === 1) {
            // warning
            messages.addMessage(path, message, 'warning', code);
          } else if (severity === 2) {
            // info
            messages.addMessage(path, message, 'info', code);
          } else if (severity === 3) {
            // hint
            messages.addMessage(path, message, 'hint', code);
          }
        } else {
          if (debug) {
            console.log(
              'There was an error while parsing the spectral results: ',
              JSON.stringify(validationResult)
            );
          }
        }
      }
    }
  }
  return messages;
};

// setup: registers the oas2/oas3 formats, and attempts to load the ruleset file
const setup = async function(openApiValidatorBuilder, providedRulesetFile, configObject) {
  if (!openApiValidatorBuilder) {
    const message =
      'Error (OpenApiValidatorBuilder): An instance of spectral has not been initialized.';
    return Promise.reject(message);
  }
  
  // load the spectral ruleset, either a user's or the default ruleset
  // const spectralRulesetURI = await config.getSpectralRuleset(
  //   rulesetFileOverride,
  //   defaultSpectralRulesetURI
  // );
  
  let ruleset;
  
  const defaultRuleset = await ibmOas3Ruleset();
  
  if (providedRulesetFile) {
    const rulesetFromProvidedRulesetFile = await config.getSpectralRuleset(providedRulesetFile);
    bundledRuleset = await bundleRuleset(providedRulesetFile, {
      target: 'node',
      format: 'commonjs',
      plugins: [
        stdin(rulesetFromProvidedRulesetFile, providedRulesetFile),
        builtins(),
        rollUp.default,
        ...node({ fs, fetch })
      ]
    });
    const loadedRuleset = loadRuleset(bundledRuleset, providedRulesetFile);
    // const loadedRulesetFromExternalSources = new Ruleset(loadedRuleset, {
    //   severity: 'recommended',
    //   source: providedRulesetFile
    // });
    // ruleset = await mergeRulesets(defaultRuleset, loadedRulesetFromExternalSources, true);
    const defRuleset = new Ruleset(defaultRuleset);
    // ruleset = loadedRulesetFromExternalSources;
    // ruleset = await mergeRulesets(defRuleset, loadedRuleset, true);
  
    const props = Object.keys(loadedRuleset.rules);
    for (let x = 0; x < props.length; x++){
      defaultRuleset.rules[props[x]] = loadedRuleset.rules[props[x]];
    }
    ruleset = defaultRuleset;
  } else {
    ruleset = defaultRuleset;
  }
  
  // Add IBM default ruleset to static assets to allow extends to reference it
  // const staticAssets = require('@stoplight/spectral/rulesets/assets/assets.json');
  // setupStaticAssets(staticAssets, defaultSpectralRulesetURI);
  // Spectral.registerStaticAssets(staticAssets);
  
  // Register formats
  // spectral.registerFormat('oas2', isOpenApiv2);
  // spectral.registerFormat('oas3', isOpenApiv3);
  
  // Load either the user-defined ruleset or our default ruleset
  // await openApiValidator.setRules(ibmOas3Ruleset)
  
  // Combine default/user ruleset with the validaterc spectral rules
  // The validaterc rules will take precendence in the case of duplicate rules
  // const userRules = Object.assign({}, openApiValidatorBuilder.rules); // Clone rules
  
  // Possibly there is, at least, a single spectral rule defined in .validaterc, which is not recommended
  // so we display a warning
  if (Object.keys(configObject.spectral.rules).length !== 0) {
    console.log('It seems Spectral rules are defined in .validaterc file. ' +
      chalk.magenta('Spectral rules should be defined in .spectral.yaml file'));
  }
  
  try {
    // const mergedRulesets = await mergeRulesets(ibmOasRuleset, rulesFromSpectralYaml, true);
    return await openApiValidatorBuilder.setRuleset(ruleset);
    // const spectral = new Spectral();
    // spectral.setRuleset(ruleset);
  } catch (err) {
    return Promise.reject(err);
  }
};

// function setupStaticAssets(staticAssets, defaultSpectralRulesetURI) {
//   // register ruleset
//   staticAssets['ibm:oas'] = addDataToSpectralConfig(defaultSpectralRulesetURI);
//  
//   const parentDirectory = path.parse(defaultSpectralRulesetURI).dir;
//  
//   // register custom functions
//   const customFunctionsDirURI = path.join(parentDirectory, 'ibm-oas');
//   fs.readdirSync(customFunctionsDirURI).forEach(function(customFunctionFile) {
//     const customFunctionURI = path.join(
//       customFunctionsDirURI,
//       customFunctionFile
//     );
//     const customFunctionRelativeURI = path.join('ibm-oas', customFunctionFile);
//     staticAssets[customFunctionRelativeURI] = fs.readFileSync(
//       customFunctionURI,
//       'utf8'
//     );
//   });
// }

function addDataToSpectralConfig(defaultSpectralRulesetURI) {
  const content = fs.readFileSync(defaultSpectralRulesetURI, 'utf8');
  return content.replace(
    '\\./schemas',
    path.join(__dirname, '../rulesets/schemas')
  );
}

function loadRuleset(source, uri) {
  const actualUri = stoplightPath.isURL(uri) ? uri.replace(/^https?:\//, '') : uri;
  const req = createRequire(actualUri);
  const m = {};
  const paths = [path.dirname(uri), __dirname];
  const _require = (id) => req(req.resolve(id,  {paths}));
  Function('module, require', source)(m,  _require);
  
  if (!isObject(m.exports)){
    throw 'No valid export found!';
  }
  
  return m.exports;
}

module.exports = {
  parseResults,
  setup
};
