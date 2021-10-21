const { Spectral } = require('@stoplight/spectral-core');

class SpectralBuilder {
  
  constructor() {
  }
  
  addRuleset(ruleset) {
    this.ruleset = ruleset;
    return this;
  }
  
  build() {
    // input validation
    
    let spectral = new Spectral();
    spectral.setRuleset(this.ruleset);
    return spectral;
    
  }
}

module.exports = SpectralBuilder;