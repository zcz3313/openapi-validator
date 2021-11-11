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
      
      test('should read .validaterc and apply spectral related rules - one rule is disabled', async () => {
        const filePath = __dirname + '/files/validaterc/validaterc_one_rule_disabled/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });
      
      test('should read .validaterc and apply spectral related rules - multiple rules are disabled', async () => {
        const filePath = __dirname + '/files/validaterc/validaterc_multiple_rules_disabled/apidef.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });
      
      test('should read .validaterc - it does not contain spectral related rules', async () => {
        const filePath = __dirname + '/files/without_config/dummy.json';
        const result = await openApiValidator(filePath);
        expect(result.errors).toBeUndefined();
        expect(result.warnings).toBeUndefined();
      });
      
    });
    
    describe('config file override - provided .spectral.yaml', () => {
      
      test('should use IBM OAS ruleset when no config file provided', async () => {
      });
      test('should load rule from provided .spectral.yaml file', async () => {
      });
      test('should load the many rules from provided .spectral.yaml file', async () => {
      });
      
    });
    
  });
});