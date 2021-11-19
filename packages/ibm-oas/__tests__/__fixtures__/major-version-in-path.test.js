const prepareASingleRuleForLoad = require('../__helpers__/prepare-a-single-rule-for-load');
const MajorVersionInPathRule = require('../../src/rules/major-version-in-path.rule');
const SpectralTestWrapper = require('../__utils__/spectral-test-wrapper');
// const re = /^Validator: spectral/;

describe('spectral - test major-version-in-path rule', () => {
  let spectralTestWrapper;
  
  beforeAll(() => {
    const majorVersionInPathRuleset = prepareASingleRuleForLoad(MajorVersionInPathRule);
    spectralTestWrapper = new SpectralTestWrapper();
    spectralTestWrapper.setRuleset(majorVersionInPathRuleset);
  });
  
  afterEach(() => {
    spectralTestWrapper.resetDocumentToBeValidated();
  });
  
  it('test major-version-in-path using mockFiles/oas3/multiple-major-versions.yml', async () => {
    
    const filePath = __dirname + '/mockFiles/oas3/multiple-major-versions.yml';
    spectralTestWrapper.setYamlFile(filePath);
    const result = await spectralTestWrapper.validate();
    
    const majorVersionInPathError = result.find(({ code }) => code === 'major-version-in-path');
    expect(majorVersionInPathError).not.toBeUndefined();
    expect(majorVersionInPathError['message'])
    .toBe('Major version segments of paths object do not match. Found v1, v2');
    expect(majorVersionInPathError.path).toEqual(['paths']);
    
    
  });
  
  it('test major-version-in-path flags multiple versions in server URLs', async () => {
    // set up mock user input
    const apidef = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Multiple versions in server URLs'
      },
      servers: [
        {
          url: 'http://petstore.swagger.io/v1'
        },
        {
          url: 'http://petstore.swagger.io/v2'
        }
      ],
      paths: {
        '/pets': {
          get: {
            summary: 'Get a list of pets',
            operationId: 'list_pets',
            responses: {
              '200': {
                description: 'Success'
              }
            }
          }
        }
      }
    };
    spectralTestWrapper.setInMemoryContent(apidef);
    const result = await spectralTestWrapper.validate();
    
    const majorVersionInPathError = result.find(({ code }) => code === 'major-version-in-path');
    expect(majorVersionInPathError).not.toBeUndefined();
    expect(majorVersionInPathError['message'])
    .toBe('Major version segments of urls in servers object do not match. Found v1, v2');
    expect(majorVersionInPathError.path).toEqual(['servers']);
  });
});
