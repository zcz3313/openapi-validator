const {Spectral, Document, Ruleset} = require('@stoplight/spectral-core');
const {httpAndFileResolver} = require("@stoplight/spectral-ref-resolver");
const spectralParsers = require("@stoplight/spectral-parsers");
const fs = require("fs/promises");
const { oas2, oas3 } = require('@stoplight/spectral-formats');

class OpenApiValidator {
  #_spectral;
  #_resolver;
  #_ruleset;
  #_documentPath;
  #_parser;
  #_document;
  #_documentInput;
  #_documentInputType;

  constructor(builder) {
    this.#_resolver = builder.resolver;
    this.#_ruleset = builder.ruleset;
    this.#_documentPath = builder.documentPath;
    this.#_parser = builder.parser;
    this.#_documentInput = builder.documentInput;
    this.#_documentInputType = builder.documentInputType;

    this.#_spectral = new Spectral({
      resolver: this.#_resolver
    });
    this.#_spectral.setRuleset(this.#_ruleset);
  }

  async validateDocument() {

    this.#_document = undefined;
    if (this.#_documentInput && this.#_documentInputType) {
      let doc = undefined;
      if (this.#_documentInputType === 'json') {
        doc = JSON.stringify(this.#_documentInput);
      }
      this.#_document = new Document(doc, this.#_parser);
    } else if (this.#_documentPath) {
      const file = await fs.readFile(this.#_documentPath, {encoding: 'utf8'});
      this.#_document = new Document(file, this.#_parser, this.#_documentPath);
    }

    return await this.#_spectral.run(this.#_document);
  }

  get spectral() {
    return this.#_spectral;
  }

  get resolver() {
    return this.#_resolver;
  }

  get ruleset() {
    return this.#_ruleset;
  }

  get documentPath() {
    return this.#_documentPath;
  }

  get parser() {
    return this.#_parser;
  }

  get document() {
    return this.#_document;
  }

  get documentInput() {
    return this.#_documentInput;
  }

  get documentInputType() {
    return this.#_documentInputType;
  }


  static get Builder() {
    class Builder {

      #_resolver;
      #_ruleset;
      #_documentPath;
      #_parser;
      #_documentInput;
      #_documentInputType;

      constructor() {
      }

      setRuleset(ruleset) {
        this.#_ruleset = {
          formats: [oas2, oas3],
          rules: ruleset
        };
        return this;
      }

      get ruleset() {
        return this.#_ruleset;
      }

      setResolver(resolver) {
        this.#_resolver = resolver;
        return this;
      }

      get resolver() {
        return this.#_resolver;
      }

      setDocumentPath(documentPath) {
        this.#_documentPath = documentPath;
        return this;
      }

      get documentPath() {
        return this.#_documentPath;
      }
      //
      // setDocumentInput(documentInput) {
      //   this.#_documentInput = documentInput;
      //   return this;
      // }
      //
      // get documentInput() {
      //   return this.#_documentInput;
      // }
      //
      // setDocumentInputType(documentInputType) {
      //   this.#_documentInputType = documentInputType;
      //   return this;
      // }
      //
      // get documentInputType() {
      //   return this.#_documentInputType;
      // }

      get parser() {
        return this.#_parser;
      }

      build() {
        if (this.#_resolver === undefined) {
          this.#_resolver = httpAndFileResolver
        }

        if (this.#_ruleset === undefined) {
          throw 'Ruleset is not an object';
        }
        if (!this.#_ruleset instanceof Ruleset) {
          throw `Ruleset must be type: ${Ruleset.name}`;
        }

        // when document input and document input type are undefined we work
        // a file on the file system
        if (this.#_documentInput === undefined && this.#_documentInputType === undefined) {

          if (this.#_documentPath === undefined) {
            throw "document path must be set up!"
          }

          if (this.#_documentPath.slice(-4) === 'yaml' || this.#_documentPath.slice(-4) === '.yml') {
            this.#_parser = spectralParsers.Yaml;
          } else if (this.#_documentPath.slice(-4) === 'json') {
            this.#_parser = spectralParsers.Json;
          } else {
            throw `Cannot determine file type! Actual filepath is: ${this.#_documentPath}`;
          }

        } else if (this.#_documentInput !== undefined && this.#_documentInputType !== undefined) {
          // when document input and document input type are not undefined
          // then we work with a provided inline document

          if (this.#_documentInputType === 'json') {
            this.#_parser = spectralParsers.Json;
          } else if (this.#_documentInputType === 'yaml' || this.#_documentInputType === 'yml') {
            this.#_parser = spectralParsers.Yaml;
          } else {
            throw `Document input type must be either 'json', 'yaml' or 'yml'. Actual value ${this.#_documentInputType}`;
          }

        } else {
          throw 'Both documentInput and documentInputType must be set up or left undefined.';
        }

        return new OpenApiValidator(this);
      }
    }

    return Builder;
  }
}

module.exports = OpenApiValidator;