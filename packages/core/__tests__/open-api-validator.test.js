const openApiValidator = require('../src/lib/index');
describe('OpenApi Validator Api - Spectral part', () => {

  test('should validate valid api definition', async () => {
    const filePath = __dirname + '/files/valid.json';
    const result = await openApiValidator(filePath);
    expect(result.errors).toBeUndefined();
    expect(result.warnings).toBeUndefined();
  });

  describe('parameter tests', () => {
    describe('default mode', () => {

      test('should ignore .validaterc when default mode is true', async () => {
      });
      test('should apply .validaterc when default mode is false', async () => {
      });
      test('should apply .validaterc when default mode is not defined', async () => {
      });

    });

    describe('.validaterc', () => {

      test('should validate file when directory does not have .validaterc', async () => {
        const filePath = __dirname + '/files/validaterc/no_validaterc/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });

      test('should read .validaterc and apply rules - one rule is disabled', async () => {
        const filePath = __dirname + '/files/validaterc/validaterc_one_rule_disabled/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });

      test('should read .validaterc and apply rules - multiple rules are disabled', async () => {
        const filePath = __dirname + '/files/validaterc/validaterc_multiple_rules_disabled/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });

      test('should display warning if spectral rule is defined in .validaterc', async () => {
      });

    });

    describe('config file override - provided .spectral.yaml', () => {

      test('should throw when provided rules from .spectral.yaml are not extend ibm-oas', async () => {
      });

      test('should use IBM OAS ruleset when no config file provided', async () => {
        const filePath = __dirname + '/files/spectralyaml/no_spectralyaml_provided/valid.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });

      test('should load rule from provided .spectral.yaml file', async () => {
        const apiDefFilePath = __dirname + '/files/spectralyaml/single_additional_spectral_rule/valid.json';
        const spectralYaml = __dirname + '/files/spectralyaml/single_additional_spectral_rule/spectral.yaml';
        const result = await openApiValidator(
          apiDefFilePath,
          false,
          null,
          spectralYaml);
        expect(result.errors).toBeUndefined();
      });
      test('should load the many rules from provided .spectral.yaml file', async () => {
      });

    });

  });
});