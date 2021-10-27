const OpenApiValidator = require('@acsanyi-test/openapi-validator-core/src/openapi-validator');

const processInput = async function(program) {
  
  let args = program.args;
  
  if (args.length === 0){
    program.help();
    return Promise.reject(2);
  }
  
  const openApiValidatorCore = new OpenApiValidator.Builder();
}

module.exports = processInput;