const {Spectral, isOpenApiv3} = require("@stoplight/spectral");
const prepareASingleRuleForLoad = require("../../../ibm-oas/__tests__/__helpers__/prepare-a-single-rule-for-load");
const ContentEntryContainsSchemaRule = require("../../../ibm-oas/src/rules/content-entry-contains-schema.rule");

describe('IBM specific rule: content entry contains shema is with Spectral 5', () => {

  let ruleset;

  beforeAll(() => {
    ruleset = prepareASingleRuleForLoad(ContentEntryContainsSchemaRule);
  });

  it('should not error when the content object contains a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          get: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                // schema provided
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    };

    const spectral = new Spectral();
    ruleset.functions = {};
    ruleset.exceptions = {};
    spectral.setRuleset(ruleset);
    spectral.registerFormat('oas3', isOpenApiv3);
    const result = await spectral.run(spec);

    const expectedWarnings = result.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  it('should error when a content object in a requestBody reference does not contain a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            requestBody: {
              $ref: '#/components/requestBodies/GenericRequestBody'
            }
          }
        }
      },
      components: {
        requestBodies: {
          GenericRequestBody: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          }
        }
      }
    };

    const spectral = new Spectral();
    ruleset.functions = {};
    ruleset.exceptions = {};
    spectral.setRuleset(ruleset);
    spectral.registerFormat('oas3', isOpenApiv3);
    const result = await spectral.run(spec);

    const expectedWarnings = result.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(1);
  });

});