const SpectralBuilder = require('../lib/builder');
const { Spectral } = require('@stoplight/spectral-core');

describe('Core builder', () => {
  it('should build a Spectral instance', async () => {
    let spectralBuilder = new SpectralBuilder();
    console.log(typeof spectralBuilder);
    spectralBuilder.addRuleset({
      rules: {
        'simple-rule': {
          given: '$.info',
          then: {
            function: () => {
              console.log('simple-rule has been called!');
            }
          }
        }
      }
    });
    const spectral = spectralBuilder.build();
    expect(spectral).not.toBeUndefined();
    expect(spectral).toBeInstanceOf(Spectral);
  });
});
