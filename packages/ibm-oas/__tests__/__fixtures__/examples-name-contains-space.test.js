// const commandLineValidator = require('../../../../src/cli-validator/runValidator');
// const { getCapturedText } = require('../../../test-utils');
// const { getMessageAndPathFromCapturedText } = require('../../../test-utils');
const prepareASingleRuleForLoad = require('../__helpers__/prepare-a-single-rule-for-load');
const ExamplesNameContainsSpaceRule = require('../../src/rules/examples-name-contains-space.rule');
const SpectralTestWrapper = require('../__utils__/spectral-test-wrapper');

describe('spectral - examples name should not contain space', () => {
  
  let spectralTestWrapper;
  
  beforeAll(async () => {
    spectralTestWrapper = new SpectralTestWrapper();
    const rule = prepareASingleRuleForLoad(ExamplesNameContainsSpaceRule);
    spectralTestWrapper.setRuleset(rule);
  });
  
  beforeEach(async () => {
    spectralTestWrapper.resetDocumentToBeValidated();
  });
  
  it('should not display error when examples name does not contain space', async () => {
    const yamlFile = __dirname + '/mockFiles/examples-name-should-not-contain-space/positive-case.yaml';
    spectralTestWrapper.setYamlFile(yamlFile);
    const result = await spectralTestWrapper.validate();
    
    const err = result.find(({code}) => code === 'examples-name-contains-space');
    expect(err).not.toBeUndefined();
    expect(err.path).toEqual([
      "paths",
      "/v1/users",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "examples",
      "success"
    ]);
  });

  it('should display error when multiple examples names contain space', async () => {

    const file = __dirname + '/mockFiles/examples-name-should-not-contain-space/negative-case.yaml';
    spectralTestWrapper.setYamlFile(file);
    const result = await spectralTestWrapper.validate();
    
    // expect(messages[0][1].get('Path')).toEqual(
    //   'paths./v1/users.get.responses.200.content.application/json.examples.success example'
    // );
    // expect(messages[1][1].get('Path')).toEqual(
    //   'paths./v1/users.get.responses.200.content.application/json.examples.failed example'
    // );
    //
    // expect(exitCode).toEqual(0);
  });
});
