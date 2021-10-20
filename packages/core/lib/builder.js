const Spectral = require('@stoplight/spectral-core');

class SpectralBuilder {
  
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

module.imports = SpectralBuilder