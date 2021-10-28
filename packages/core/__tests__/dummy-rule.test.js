const {oas2, oas3} = require("@stoplight/spectral-formats");
const {pattern, truthy} = require("@stoplight/spectral-functions");
const OpenApiValidator = require("../src/openapi-validator");
describe('Validating inline and file documents', () => {

  test('should validate inline json document with loaded rule', async () => {

    const spec = {
      openapi: '3.0.0.',
      info: {
        version: '1.0.0.',
        title: 'Summary has trailing period'
      },
      servers: {},
      paths: {
        createTrailingPeriod: {
          post: {
            operationId: 'createTrailingPeriod',
            description: 'creates trailing period',
            summary: 'Adds trailing period.'
          }
        }
      }
    };
    const ruleset = {
      formats: [oas2, oas3],
      rules: {
        "dummy": {
          formats: [oas3],
          given: '$.paths[*][*].summary',
          then: {
            function: pattern,
            functionOptions: {
              notMatch: '\\.$'
            }
          }
        }
      }
    };

    const openApiValidator = new OpenApiValidator.Builder()
      .setRuleset(ruleset)
      .setDocumentInput(spec)
      .setDocumentInputType("json")
      .build();

    const result = await openApiValidator.validateDocument();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual(['paths', 'createTrailingPeriod', 'post', 'summary']);

  });
  
  test('should validate json file with loaded rule', async () => {
    
    const ruleset = {
      formats: [oas2, oas3],
      rules: {
        "dummy": {
          formats: [oas3],
          given: '$.paths[*][*].summary',
          then: {
            function: pattern,
            functionOptions: {
              notMatch: '\\.$'
            }
          }
        }
      }
    };
    
    const openApiValidator = new OpenApiValidator.Builder()
    .setRuleset(ruleset)
    .setDocuments(__dirname + "/files/dummy.json")
    .build();
    
    const result = await openApiValidator.validateDocument();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual(['paths', '/create-trailing-period', 'post', 'summary']);
    
  });

  test('should validate yaml file with loaded rule', async () => {

    const ruleset = {
      formats: [oas2, oas3],
      rules: {
        "dummy": {
          formats: [oas3],
          given: '$.paths[*][*].summary',
          then: {
            function: pattern,
            functionOptions: {
              notMatch: '\\.$'
            }
          }
        }
      }
    };

    const openApiValidator = new OpenApiValidator.Builder()
      .setRuleset(ruleset)
      .setDocuments(__dirname + "/files/dummy.yaml")
      .build();

    const result = await openApiValidator.validateDocument();
    expect(result.length).toBe(1);
    expect(result[0].path).toEqual(['paths', '/create-trailing-period', 'post', 'summary']);

  });

});