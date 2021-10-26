const OpenApiValidator = require("../src/openapi-validator");
const {Document} = require("@stoplight/spectral-core");
const spectralParsers = require("@stoplight/spectral-parsers");
const {oas} = require("@stoplight/spectral-rulesets");
const {oas2, oas3_0, oas3} = require("@stoplight/spectral-formats");
const {pattern} = require("@stoplight/spectral-functions");
const {httpAndFileResolver, Resolver} = require("@stoplight/spectral-ref-resolver");

describe('OpenApiValidator Builder', () => {

  describe('Rulesets', () => {

    test('should throw when ruleset is empty', async () => {
      const builder = new OpenApiValidator.Builder();
      expect(() => builder.build()).toThrowError();
    });

    test('should set up ruleset', async () => {
      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          },
          "dummy2": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          },
          "dummy3": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentInput("")
        .setDocumentInputType("json");
      const openApiValidator = openApiValidatorBuilder.build();

      expect(openApiValidator.ruleset).toEqual(ruleset);
    });

    test('should throw when ruleset is not Ruleset type', async () => {
      const builder = new OpenApiValidator.Builder();
      builder.setDocumentPath("");
      const ruleset = {};
      builder.setRuleset(ruleset);
      expect(() => {
        builder.build()
      }).toThrowError();
    });

  });

  describe('Resolver', () => {

    test('Default resolver is httpAndFileResolver', async () => {
      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentInput("")
        .setDocumentInputType("json");
      const openApiValidator = openApiValidatorBuilder.build();

      expect(openApiValidator.resolver).toBeInstanceOf(Resolver);
      expect(openApiValidator.resolver.resolvers['file']).not.toBeUndefined();
      expect(openApiValidator.resolver.resolvers['http']).not.toBeUndefined();
    });

  });

  describe('document path', () => {

    test('should throw error when a file is validated but path is not set up', async () => {
      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset);
      expect(() => openApiValidatorBuilder.build()).toThrowError();

    });

    test('should set document path up', async () => {
      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentPath("some.json");
      const openapiValidator = openApiValidatorBuilder.build();
      expect(openapiValidator.documentPath).not.toBeUndefined();
      expect(openapiValidator.documentPath).toEqual("some.json");

    });

  });

  describe('document type', () => {

    test('should throw when document type is not defined in case of inline documents', async () => {

      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentInput("{}");
      expect(() => openApiValidatorBuilder.build()).toThrowError();

    });

    test('should set document type up in case of inline validation', async () => {

      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentInput("{}")
        .setDocumentInputType("json");

      const openapiValidator = openApiValidatorBuilder.build();

      expect(openapiValidator.documentInputType).toEqual("json");

    });

  });

  describe('Parser', () => {

    test('should determine parser based on file extension', async () => {

      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentPath("asd.json");
      const openapiValidator = openApiValidatorBuilder.build();
      expect(openapiValidator.parser).toBe(spectralParsers.Json);

    });

    test('should be able to determine parser by file extensions - yaml', async () => {

      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentPath("asd.yaml");
      const openapiValidator = openApiValidatorBuilder.build();
      expect(openapiValidator.parser).toEqual(spectralParsers.Yaml);

    });

    test('should be able to determine parser by file extensions - yml', async () => {

      const ruleset = {
        formats: [oas2, oas3],
        rules: {
          "dummy": {
            formats: [oas3],
            given: '',
            then: {
              function: pattern,
              functionOptions: {
                notMatch: '\\.$'
              }
            }
          }
        }
      };
      const openApiValidatorBuilder = new OpenApiValidator.Builder()
        .setRuleset(ruleset)
        .setDocumentPath("asd.yml");
      const openapiValidator = openApiValidatorBuilder.build();
      expect(openapiValidator.parser).toEqual(spectralParsers.Yaml);

    });

  });

  test('should build a certain type', async () => {
    const builder = new OpenApiValidator.Builder();
    const ruleset = {
      formats: [oas2, oas3],
      rules: {
        "dummy": {
          formats: [oas3],
          given: '',
          then: {
            function: pattern,
            functionOptions: {
              notMatch: '\\.$'
            }
          }
        }
      }
    };
    builder.setRuleset(ruleset)
      .setDocumentInput("")
      .setDocumentInputType("json");
    const openApiValidator = builder.build();
    expect(openApiValidator).toBeInstanceOf(OpenApiValidator);
  });
});
