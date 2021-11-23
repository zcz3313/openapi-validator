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
  
  test('should not display error when examples name does not contain space', async () => {
    const yamlFile = __dirname + '/mockFiles/examples-name-should-not-contain-space/single-no-space-in-name.yaml';
    spectralTestWrapper.setYamlFile(yamlFile);
    const result = await spectralTestWrapper.validate();
    
    const err = result.find(({code}) => code === 'examples-name-contains-space');
    expect(err).toBeUndefined();
  });
  
  test('should not display error when examples name does not contain space - multiple', async () => {
    const yamlFile = __dirname + '/mockFiles/examples-name-should-not-contain-space/multiple-no-space-in-name.yaml';
    spectralTestWrapper.setYamlFile(yamlFile);
    const result = await spectralTestWrapper.validate();
    
    const err = result.find(({code}) => code === 'examples-name-contains-space');
    expect(err).toBeUndefined();
  });

  test('should display error when example name contain space', async () => {

    const file = __dirname + '/mockFiles/examples-name-should-not-contain-space/negative-case.yaml';
    spectralTestWrapper.setYamlFile(file);
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
      "success example"
    ]);
  });
  
  test('should display error when example name contain space - single quote', async () => {
    
    const file = __dirname + '/mockFiles/examples-name-should-not-contain-space/negative-case-single-quote.yaml';
    spectralTestWrapper.setYamlFile(file);
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
      "success example"
    ]);
  });
  
  test('should display error when example name contain space - multiple mixed', async () => {
    
    const file = __dirname + '/mockFiles/examples-name-should-not-contain-space/negative-case-multiple-mixed.yaml';
    spectralTestWrapper.setYamlFile(file);
    const result = await spectralTestWrapper.validate();
    
    const err = result.filter(({code}) => code === 'examples-name-contains-space');
    expect(err.length).toBe(2);
    const err1 = err.find((a) => a.path.includes('with quotes'));
    expect(err1).not.toBeUndefined();
    expect(err1.path).toEqual([
      "paths",
      "/v1/users",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "examples",
      "with quotes"
    ]);
    const err2 = err.find((b) => b.path.includes('without quotes'));
    expect(err2).not.toBeUndefined();
    expect(err2.path).toEqual([
      "paths",
      "/v1/users",
      "get",
      "responses",
      "200",
      "content",
      "application/json",
      "examples",
      "without quotes"
    ]);
  });
});
