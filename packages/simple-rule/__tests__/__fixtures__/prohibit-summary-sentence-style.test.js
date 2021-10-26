const ProhibitSummarySentenceStyle = require("../../src/rules/prohibit-summary-sentence-style");
const jsonParser = require("@stoplight/spectral-parsers");
const {Document} = require('@stoplight/spectral-core')
const prepareASingleRuleForLoad = require("../__helpers__/prepare-a-single-rule-for-load");
const {httpAndFileResolver} = require("@stoplight/spectral-ref-resolver");
const {DiagnosticSeverity} = require('@stoplight/types');
const OpenApiValidator = require("@acsanyi-test/openapi-validator-core/src/openapi-validator");

describe('Rule -- Prohibit summary sentence style', () => {
  let openApiValidator;

  beforeAll(async () => {
    let ruleSet = prepareASingleRuleForLoad(ProhibitSummarySentenceStyle)
    openApiValidator = new OpenApiValidator.Builder()
      .setResolver(httpAndFileResolver)
      .setRuleset(ruleSet)
      .build();
  });

  test('should not display error when summary does not have trailing period', async () => {
    const spec = {
      openapi: '3.0',
      info: {
        version: '1.0.0',
        title: 'Summary does not have trailing comma'
      },
      servers: {},
      paths: {
        createTrailingPeriod: {
          post: {
            operationId: 'createTrailingPeriod',
            description: 'creates trailing period',
            summary: 'No trailing period here'
          }
        }
      }
    };

    const document = new Document(
      JSON.stringify(spec),
      jsonParser.Json
    )

    const result = await openApiValidator.run(document);
    expect(result).not.toBeUndefined();
  });

  test('should display error when summary has trailing period', async () => {
    const spec = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Summary has trailing period'
      },
      servers: {},
      paths: {
        createTrailingPeriod: {
          post: {
            operationId: 'createTrailingPeriod',
            description: 'creates trailing period',
            summary: 'There is a trailing period here.'
          }
        }
      }
    };

    const document = new Document(
      JSON.stringify(spec),
      jsonParser.Json
    )

    const result = await openApiValidator.run(document);
    expect(result).not.toBeUndefined();
    expect(result.length).toBe(1);
    const errors = result.filter(({code}) => code === ProhibitSummarySentenceStyle.ruleName);
    expect(errors[0].path).toEqual(['paths', 'createTrailingPeriod', 'post', 'summary']);
    expect(errors[0].severity).toEqual(DiagnosticSeverity.Warning);
  });

  test('should display errors when multiple summaries have trailing periods', async () => {
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
        },
        createUser: {
          post: {
            operationId: 'createUser',
            description: 'Creates a new user',
            summary: 'Creates a new user.'
          }
        }
      }
    };

    const document = new Document(
      JSON.stringify(spec),
      jsonParser.Json
    );

    const result = await openApiValidator.run(document);
    expect(result).not.toBeUndefined();
    const errors = result.filter(({code}) => code === ProhibitSummarySentenceStyle.ruleName);
    expect(errors.length).toBe(2);

    expect(errors[0].path).toEqual([
      'paths',
      'createTrailingPeriod',
      'post',
      'summary'
    ]);
    expect(errors[1].path).toEqual(['paths', 'createUser', 'post', 'summary']);
  });
});