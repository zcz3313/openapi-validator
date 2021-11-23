const prepareASingleRuleForLoad = require('../__helpers__/prepare-a-single-rule-for-load');
const ContentEntryContainsSchemaRule = require('../../src/rules/content-entry-contains-schema.rule');
const SpectralTestWrapper = require('../__utils__/spectral-test-wrapper');

describe('spectral - test validation that schema provided in content object', function () {

  let spectralTestWrapper;

  beforeAll(() => {
    const contentEntryContainsSchemaRule = prepareASingleRuleForLoad(ContentEntryContainsSchemaRule);
    spectralTestWrapper = new SpectralTestWrapper();
    spectralTestWrapper.setRuleset(contentEntryContainsSchemaRule);
  });

  afterEach(() => {
    // we reset spectralTestWrapper after each test, so the content can be set up again
    spectralTestWrapper.resetDocumentToBeValidated();
  });

  test('should not error when the content object contains a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          get: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                // schema provided
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    };

    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();

    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(0);
  });

  test('should error when a content object in a requestBody reference does not contain a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            requestBody: {
              $ref: '#/components/requestBodies/GenericRequestBody'
            }
          }
        }
      },
      components: {
        requestBodies: {
          GenericRequestBody: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          }
        }
      }
    };

    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    // const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(1);
  });
  
  test('should error when a content object in a requestBody reference does not contain a schema in multiple cases', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            requestBody: {
              $ref: '#/components/requestBodies/GenericRequestBody'
            }
          }
        },
        path2: {
          post: {
            requestBody: {
              $ref: '#/components/requestBodies/GenericRequestBody2'
            }
          }
        }
      },
      components: {
        requestBodies: {
          GenericRequestBody: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          },
          GenericRequestBody2: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          }
        }
      }
    };
    
    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    // const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(2);
  });

  test('should error when a content object in a response reference does not contain a schema', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse'
              }
            }
          }
        }
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          }
        }
      }
    };

    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    // const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(1);
  });
  
  test('should error when a content object in a response reference does not contain a schema - multiple cases', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        path1: {
          post: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse'
              }
            }
          }
        },
        path2: {
          post: {
            responses: {
              '200': {
                $ref: '#/components/responses/GenericResponse2'
              }
            }
          }
        }
  
      },
      components: {
        responses: {
          GenericResponse: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          },
          GenericResponse2: {
            content: {
              'application/json': {
                // schema not provided
              }
            }
          }
  
        }
      }
    };
    
    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    // const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(2);
  });

  test('should error when the content object does not contain a schema in a response', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        'pets/{petId}': {
          get: {
            operationId: 'getPetsById',
            responses: {
              200: {
                content: {
                  '*/*': {
                    // schema not provided
                  }
                }
              },
              default: {
                content: {
                  'text/html': {
                    // schema not provided
                  }
                }
              }
            }
          }
        }
      }
    };

    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    // const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(2);
  });
  
  test('should error when the content object does not contain a schema in a response - multiple cases', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        'pets/{petId}': {
          get: {
            operationId: 'getPetsById',
            responses: {
              200: {
                content: {
                  '*/*': {
                    // schema not provided
                  }
                }
              },
              default: {
                content: {
                  'text/html': {
                    // schema not provided
                  }
                }
              }
            }
          }
        },
        'pets/{petId2}': {
          get: {
            operationId: 'getPetsById2',
            responses: {
              200: {
                content: {
                  '*/*': {
                    // schema not provided
                  }
                }
              },
              default: {
                content: {
                  'text/html': {
                    // schema not provided
                  }
                }
              }
            }
          }
        }
  
      }
    };
    
    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    // const res = await inCodeValidator(spec, true);
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(4);
  });  

  test('should error when the content object does not contain a schema in a request body', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        createPet: {
          post: {
            operationId: 'addPet',
            requestBody: {
              content: {
                'application/json': {
                  // no schema provided
                }
              }
            }
          }
        }
      }
    };

    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(1);
  });
  
  test('should error when the content object does not contain a schema in a request body - multiple cases', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        createPet: {
          post: {
            operationId: 'addPet',
            requestBody: {
              content: {
                'application/json': {
                  // no schema provided
                }
              }
            }
          }
        },
        createPet2: {
          post: {
            operationId: 'addPet2',
            requestBody: {
              content: {
                'application/json': {
                  // no schema provided
                }
              }
            }
          }
        }
  
      }
    };
    
    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(2);
  });

  test('should error when the content object does not contain a schema in a parameter', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        createPet: {
          post: {
            operationId: 'addPet',
            parameters: [
              {
                name: 'exampleParam1',
                description: 'example param 1',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              },
              {
                name: 'exampleParam2',
                description: 'example param 2',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              }
            ]
          }
        }
      }
    };

    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(2);
  });
  
  test('should error when the content object does not contain a schema in a parameter - multiple cases', async () => {
    const spec = {
      openapi: '3.0.0',
      paths: {
        createPet: {
          post: {
            operationId: 'addPet',
            parameters: [
              {
                name: 'exampleParam1',
                description: 'example param 1',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              },
              {
                name: 'exampleParam2',
                description: 'example param 2',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              }
            ]
          }
        },
        createPet2: {
          post: {
            operationId: 'addPet2',
            parameters: [
              {
                name: 'exampleParam1',
                description: 'example param 1',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              },
              {
                name: 'exampleParam2',
                description: 'example param 2',
                in: 'query',
                content: {
                  'application/json': {
                    // no schema provided
                  }
                }
              }
            ]
          }
        }
      }
    };
    
    spectralTestWrapper.setInMemoryContent(spec);
    const res = await spectralTestWrapper.validate();
    const expectedWarnings = res.filter(
      warn => warn.message === 'Content entries must specify a schema'
    );
    expect(expectedWarnings.length).toBe(4);
  });
  
});
