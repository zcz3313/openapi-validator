const openApiValidator = require('../../../src/lib');
describe('OpenApi Validator Api - Spectral part', () => {
  
  test.skip('should validate valid api definition', async () => {
    const filePath = __dirname + '/files/valid.json';
    const result = await openApiValidator(filePath);
    expect(result.errors).toBeUndefined();
    expect(result.warnings).toBeUndefined();
  });
  
  describe('parameter tests', () => {
    describe('default mode', () => {
      
      test.skip('should ignore .validaterc when default mode is true', async () => {
      });
      test.skip('should apply .validaterc when default mode is false', async () => {
      });
      test.skip('should apply .validaterc when default mode is not defined', async () => {
      });
      
    });
    
    describe('.validaterc', () => {
      
      test.skip('should validate file when directory does not have .validaterc', async () => {
        const filePath = __dirname + '/files/validaterc/no_validaterc/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });
      
      test.skip('should read .validaterc and apply rules - one rule is disabled', async () => {
        const filePath = __dirname + '/files/validaterc/validaterc_one_rule_disabled/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });
      
      test.skip('should read .validaterc and apply rules - multiple rules are disabled', async () => {
        const filePath = __dirname + '/files/validaterc/validaterc_multiple_rules_disabled/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });
      
      test.skip('should display warning if spectral rule is defined in .validaterc', async () => {
      });
      
    });
    
    describe('provided .spectral.yaml', () => {
      
      test.skip('should throw when provided rules from .spectral.yaml does not extend ibm-oas', async () => {
      });
      
      test('should use IBM OAS ruleset when no config file provided', async () => {
        const filePath = __dirname + '/spectralyaml/no_spectralyaml_provided/valid.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });
  
      test('should use IBM OAS ruleset when no config file provided', async () => {
        const filePath = __dirname + '/spectralyaml/no_spectralyaml_provided2/valid.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).not.toBeUndefined();
      });
      
      test('should load rule from provided .spectral.yaml file', async () => {
        const apiDefFilePath = __dirname + '/spectralyaml/single_additional_spectral_rule/valid.json';
        const spectralYaml = __dirname + '/spectralyaml/single_additional_spectral_rule/spectral.yaml';
        const result = await openApiValidator(
          apiDefFilePath,
          false,
          null,
          spectralYaml);
        expect(result.errors).not.toBeUndefined();
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].rule === 'title-must-be-longer-than-five-characters').toBeTruthy();
        expect(result.errors[0].path).toEqual(['info', 'title']);
      });
      
      test('should load multiple rules from provided .spectral.yaml file', async () => {
        const apiDefFilePath = __dirname + '/spectralyaml/multiple_rules_from_provided_spectral_yaml/valid.json';
        const spectralYaml = __dirname + '/spectralyaml/multiple_rules_from_provided_spectral_yaml/spectral.yaml';
        const result = await openApiValidator(
          apiDefFilePath,
          false,
          null,
          spectralYaml
        );
        expect(result.errors).not.toBeUndefined();
        expect(result.errors.length).toBe(2);
        expect(result.errors[0].rule === 'title-must-be-longer-than-five-characters').toBeTruthy();
        expect(result.errors.filter(s => {
          if (s.rule === 'title-must-be-longer-than-five-characters') {
            return true;
          }
        })).toBeTruthy();
        const titleError = result.errors.find(({rule}) => rule === 'title-must-be-longer-than-five-characters');
        expect(titleError.path).toEqual(['info', 'title']);
        expect(result.errors.filter(s => {
          if (s.rule === 'description-must-be-longer-than-five-characters') {
            return true;
          }
        })).toBeTruthy();
        const descError = result.errors.find(({rule}) => rule === 'description-must-be-longer-than-five-characters');
        expect(descError.path).toEqual([
          'paths',
          '/create_trailing_period',
          'post',
          'description'
        ]);
      });
      
      test('a provided rule should overwrite existing rule with the same name', async () => {
        const apiDefFilePath = __dirname + '/spectralyaml/overwrite/valid.json';
        const spectralYaml = __dirname + '/spectralyaml/overwrite/spectral.yaml';
        const result = await openApiValidator(
          apiDefFilePath,
          false,
          null, 
          spectralYaml
        );
        expect(result.warnings).toBeUndefined();
        expect(result.errors).not.toBeUndefined();
        expect(result.errors.filter(s => {
          if (s.rule === 'prohibit-summary-sentence-style') {
            return true;
          }
        })).toBeTruthy();
        const summaryError = result.errors.find(({rule}) => rule === 'prohibit-summary-sentence-style');
        expect(summaryError.path)
      });
      
    });
    
  });
});