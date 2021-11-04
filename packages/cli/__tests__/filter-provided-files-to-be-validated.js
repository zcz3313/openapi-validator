const { CliRunner } = require('../src/utils/cli-runner');

describe('Cli-Runner', () => {
  describe('Filter provided files', () => {
    describe('Validate file by file type', () => {
      test('Should accept json file type', async () => {
        const file = ['./files/dummy.json'];
        const program = {};
        program.args = file;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(1);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual(file);
      });
      test('Should accept yaml file type', async () => {
        const file = ['./files/dummy.yaml'];
        const program = {};
        program.args = file;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          0
        );
        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(1);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual(file);
      });

      test('Should accept yml file type', async () => {
        const file = ['./files/dummy.yml'];
        const program = {};
        program.args = file;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          0
        );
        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(1);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual(file);
      });
      test('Should not accept other than json, yaml and yml file type', async () => {
        const file = ['./files/dummy.txt'];
        const program = {};
        program.args = file;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(0);
        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          1
        );
        expect(openApiValidationExecutionResult.notAcceptedFiles).toEqual(file);
      });
    });

    describe('Multiple files', () => {
      test('Should accept multiple json files for validation', async () => {
        const files = [
          './files/dummy.json',
          './files/dummy2.json',
          './files/dummy3.json'
        ];
        const program = {};
        program.args = files;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(3);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual(files);
        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          0
        );
      });

      test('Should accept multiple yaml files for validation', async () => {
        const files = [
          './files/dummy.yaml',
          './files/dummy2.yaml',
          './files/dummy3.yaml'
        ];
        const program = {};
        program.args = files;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(3);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual(files);
        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          0
        );
      });

      test('Should accept multiple yml files for validation', async () => {
        const files = [
          './files/dummy.yml',
          './files/dummy2.yml',
          './files/dummy3.yml'
        ];
        const program = {};
        program.args = files;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(3);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual(files);
        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          0
        );
      });

      test('Should accept multiple json, yaml and yml files for validation', async () => {
        const files = [
          './files/dummy.json',
          './files/dummy2.yaml',
          './files/dummy3.yml'
        ];
        const program = {};
        program.args = files;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(3);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual(files);
        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          0
        );
      });

      test('Should accept multiple json, yaml and yml files and not accept other file type for validation', async () => {
        const files = [
          './files/dummy.json',
          './files/dummy2.yaml',
          './files/dummy3.txt'
        ];
        const program = {};
        program.args = files;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(2);
        expect(openApiValidationExecutionResult.acceptedFiles).toEqual([
          files[0],
          files[1]
        ]);
        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          1
        );
        expect(openApiValidationExecutionResult.notAcceptedFiles).toEqual([
          files[2]
        ]);
      });

      test('Should not accept not supported files for validation', async () => {
        const files = [
          './files/dummy.mkv',
          './files/dummy2.md',
          './files/dummy3.txt'
        ];
        const program = {};
        program.args = files;

        const cliRunner = new CliRunner.Builder().setProgram(program).build();

        const openApiValidationExecutionResult = await cliRunner.execute();

        expect(openApiValidationExecutionResult.acceptedFiles.length).toBe(0);
        expect(openApiValidationExecutionResult.notAcceptedFiles.length).toBe(
          3
        );
        expect(openApiValidationExecutionResult.notAcceptedFiles).toEqual(
          files
        );
      });
    });
  });
});
