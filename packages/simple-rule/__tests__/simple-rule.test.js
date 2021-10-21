const simpleRule = require('../src/rules/simple-rule');
const SpectralBuilder = require('../../core/lib/builder');
const document = require('@stoplight/spectral-core');
const jsonParser = require('@stoplight/spectral-parsers');

describe('simple-rule', () => {
  it('needs tests', async () => {
    const rule = simpleRule;
    let spectral = new SpectralBuilder()
    .addRuleset(simpleRule);

    const document = new document.Document(
      `{ "something" : null}`,
      jsonParser.Json,
      path.join(__dirname, 'street-doc.json')
    );

    const res = await spectral.run(document);
    expect(res).not.toBeUndefined();
  });
});
