const { oas3 } = require('@stoplight/spectral-formats');
const { pattern } = require('@stoplight/spectral-functions');
const { Spectral, Document } = require('@stoplight/spectral-core');
const { Json } = require('@stoplight/spectral-parsers');
describe('asd', () => {
  
  const jsonSpec = {
    openapi: '3.0.3',
    info: {
      title: 'Examples name should not contain space',
      description: 'Examples name should not contain space',
      version: '1.0.0'
    },
    servers: [
      {
        url: 'https://example.com'
      }
    ],
    paths: {
      '/v1/users': {
        get: {
          operationId: 'get_users',
          summary: 'returns user list',
          responses: {
            200: {
              description: 'returns list of users',
              content: {
                'application/json': {
                  schema: {
                    properties: {
                      id: {
                        type: 'string'
                      }
                    }
                  },
                  examples: {
                    'success example': {
                      summary: 'successful example',
                      value: 'success value'
                    },
                    'failed example': {
                      summary: 'failed request',
                      value: 'failed request value'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  
  const jsRule = {
    formats: [oas3],
    extends: 'spectral:oas',
    rules: {
      description: 'Examples name should not contain space',
      message: "Examples name should not contain space",
      severity: 'warn',
      resolved: false,
      formats: [oas3],
      given: '$.paths[*][*].responses[*][*][*].examples[*]~',
      then: {
        function: pattern,
        functionOptions: {
          notMatch: '^(.*\s+.*)+$'
        }
      }
    }
  };
  
  test('json input js rule', async () => {
    
    const spectral = new Spectral();
    spectral.setRuleset(jsRule);
    const doc = new Document(JSON.stringify(jsonSpec), Json);
    const result = spectral.run(doc);
    
  });
  
});