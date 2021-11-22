const {Spectral, Document} = require('@stoplight/spectral-core');
const fs = require('fs/promises');
const {Yaml, Json} = require('@stoplight/spectral-parsers');

class SpectralTestWrapper {

  #_ruleset;
  #_yamlPath;
  #_jsonPath;
  #_inMemoryContent;

  setRuleset(ruleset) {
    this.#_ruleset = ruleset;
    return this;
  }

  setYamlFile(yamlPath) {
    this.#_yamlPath = yamlPath;
    return this;
  }

  setJsonFile(jsonPath) {
    this.#_jsonPath = jsonPath;
    return this;
  }

  setInMemoryContent(content) {
    this.#_inMemoryContent = content;
    return this;
  }

  resetDocumentToBeValidated() {
    this.#_inMemoryContent = undefined;
    this.#_jsonPath = undefined;
    this.#_yamlPath = undefined;
  }

  async validate() {

    if (this.#_ruleset === undefined) {
      throw 'Error: ruleset must be defined!';
    }

    const spectral = new Spectral();
    spectral.setRuleset(this.#_ruleset);

    let result;

    if (this.#_yamlPath !== undefined
      && this.#_jsonPath === undefined
      && this.#_inMemoryContent === undefined) {

      const file = await fs.readFile(this.#_yamlPath, {encoding: 'utf-8'});
      const doc = new Document(file, Yaml);
      result = await spectral.run(doc);

    } else if (this.#_jsonPath !== undefined
      && this.#_yamlPath === undefined
      && this.#_inMemoryContent === undefined) {

      const file = await fs.readFile(this.#_jsonPath, {encoding: 'utf-8'});
      const doc = new Document(file, Json);
      result = await spectral.run(doc);

    } else if (
      this.#_inMemoryContent !== undefined
      && this.#_yamlPath === undefined
      && this.#_jsonPath === undefined
    ) {

      const stringified = JSON.stringify(this.#_inMemoryContent);
      const doc = new Document(stringified, Json);
      result = await spectral.run(doc);

    } else {
      throw 'Error: multiple content is setup for validation.' +
      ' This wrapper can handle only one!';
    }

    if (result === undefined) {
      return [];
    }

    return result;
  }

}

module.exports = SpectralTestWrapper;