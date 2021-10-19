import { Spectral } from '@stoplight/spectral-core';

export class SpectralBuilder {
  
  addRuleset(ruleset) {
    this.ruleset = ruleset;
    return this;
  }
  
  build() {
    // input validation
    
    const spectral = new Spectral();
    spectral.setRuleset(this.ruleset);
    return spectral;
    
  }
}