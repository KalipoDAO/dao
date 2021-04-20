export const daoAssetSchema = {
  $id: "lisk/dao",
  type: "object",
  required: ["id", "name", "nonce", "members",],
  properties: {
    id: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    name: {
      dataType: "string",
      fieldNumber: 2,
      minLength: 3,
      maxLength: 20,
    },
    nonce: {
      dataType: "uint64",
      fieldNumber: 3,
    },
    members: {
      type: "array",
      fieldNumber: 4,
      minItems: 1,
      items: {
        type: "object",
        required: ["id", "nonce"],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          nonce: {
            dataType: "uint64",
            fieldNumber: 2,
          },
          isDao: {
            dataType: "boolean",
            fieldNumber: 3,
            default: false,
          },
          isOwner: {
            dataType: "boolean",
            fieldNumber: 4,
            default: false,
          },
        }
      }
    },
    rules: {
      type: "object",
      fieldNumber: 5,
      required: ["quorum",],
      properties: {
        quorum: {
          dataType: "uint32",
          fieldNumber: 1,
          default: 50
        },
        freeQuorum: {
          dataType: "boolean",
          fieldNumber: 2,
          default: false,
        },
        minQuorum: {
          dataType: "uint32",
          fieldNumber: 3,
          default: 50,
        },
      }
    },
  }
}

export const daosStoreSchema = {
  $id: "lisk/dao/list",
  type: "object",
  required: ['daos'],
  properties: {
    daos: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ['id', 'name'],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          name: {
            dataType: "string",
            fieldNumber: 2,
          }
        }
      }
    }
  }
}

export const proposalAssetSchema = {
  $id: "lisk/dao/proposal",
  type: "object",
  required: [
    "id",
    "creator",
    "description",
    "options",
    "rules",
    "nonce",
    "start",
    "end",
    "actions",
    "state",
  ],
  properties: {
    id: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    creator: {
      dataType: "bytes",
      fieldNumber: 2,
      minLength: 20,
      maxLength: 20,
    },
    description: {
      dataType: "string",
      fieldNumber: 3,
      minLength: 5,
      maxLength: 140,
    },
    options: {
      type: "array",
      fieldNumber: 4,
      minItems: 2,
      maxItems: 10,
      items: {
        type: "object",
        required: ["label", "id"],
        properties: {
          label: {
            dataType: "string",
            fieldNumber: 1,
            minLength: 1,
            maxLength: 100,
          },
          id: {
            dataType: "bytes",
            fieldNumber: 2,
          },
        }
      }
    },
    rules: {
      type: "object",
      fieldNumber: 5,
      required: ["allowedOptions", "binaryVote", "quorum", "minToWin"],
      properties: {
        allowedOptions: {
          dataType: "uint32",
          fieldNumber: 1,
          default: 1.
        },
        binaryVote: {
          dataType: "boolean",
          fieldNumber: 2,
          default: true,
        },
        quorum: {
          dataType: "uint32",
          fieldNumber: 3,
          default: 50,
        },
        minToWin: {
          dataType: "uint32",
          fieldNumber: 4,
          default: 50,
        },
      }
    },
    nonce: {
      dataType: "uint64",
      fieldNumber: 6,
    },
    start: {
      dataType: "uint32",
      fieldNumber: 7,
    },
    end: {
      dataType: "uint32",
      fieldNumber: 8,
    },
    state: {
      dataType: "string",
      fieldNumber: 9,
      enum: ["unresolved", "resolved"],
      default: "unresolved",
    },
    actions: {
      type: "array",
      fieldNumber: 10,
      minItems: 0,
      maxItems: 5,
      items: {
        type: "object",
        required: ["moduleID", "reducers",],
        properties: {
          moduleID: {
            dataType: "uint32",
            fieldNumber: 1,
          },
          reducers: {
            dataType: "string",
            fieldNumber: 2,
          },
          params: {
            type: "array",
            fieldNumber: 3,
            minItems: 0,
            items: {
              type: "object",
              required: ["k", "v", "paramType"],
              properties: {
                k: {
                  dataType: 'string',
                  fieldNumber: 1,
                },
                v: {
                  dataType: 'string',
                  fieldNumber: 2
                },
                paramType: {
                  dataType: 'string',
                  fieldNumber: 3,
                  enum: ["string", "uint32", "uint64", "sint64", "boolean", "bytes"],
                }
              }
            }
          },
          acceptor: {
            dataType: "bytes",
            fieldNumber: 4,
            minLength: 20,
            maxLength: 20,
          }
        }
      }
    },
  }
}

export const proposalsStoreSchema = {
  $id: "lisk/dao/proposal/list",
  type: "object",
  required: ['proposals'],
  properties: {
    proposals: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ['id', 'daoId'],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          daoId: {
            dataType: "bytes",
            fieldNumber: 2,
          },
        }
      }
    }
  }
}

export const daoProposalsStoreSchema = {
  $id: "lisk/dao/proposal/link",
  type: "object",
  required: ["proposals"],
  properties: {
    proposals: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ['id', 'nonce'],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          nonce: {
            dataType: "uint64",
            fieldNumber: 2,
          },
        }
      }
    }
  }
}

export const createDaoSchema = {
  $id: "lisk/dao/create",
  type: "object",
  required: ["name", "members", "rules"],
  properties: {
    name: {
      dataType: "string",
      fieldNumber: 1,
      minLength: 3,
      maxLength: 20,
    },
    members: {
      type: "array",
      fieldNumber: 2,
      minItems: 0,
      maxItems: 20,
      items: {
        type: "object",
        required: ['id', 'isDao'],
        properties: {
          id: {
            dataType: 'bytes',
            fieldNumber: 1,
          },
          isDao: {
            dataType: 'boolean',
            fieldNumber: 2,
          }
        },
      }
    },
    rules: {
      type: "object",
      fieldNumber: 3,
      properties: {
        quorum: {
          dataType: "uint32",
          fieldNumber: 1,
          default: 50,
        },
        freeQuorum: {
          dataType: "boolean",
          fieldNumber: 2,
          default: false,
        },
        minQuorum: {
          dataType: "uint32",
          fieldNumber: 3,
          default: 50,
        },
      }
    }
  }
}

export const createProposalSchema = {
  $id: "lisk/dao/createProposal",
  type: "object",
  required: ["description"],
  properties: {
    dao: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    description: {
      dataType: "string",
      fieldNumber: 2,
      minLength: 5,
      maxLength: 140,
    },
    options: {
      type: "array",
      fieldNumber: 3,
      minItems: 0,
      maxItems: 10,
      items: {
        type: "object",
        required: ["label"],
        properties: {
          label: {
            dataType: "string",
            fieldNumber: 1,
            minLength: 1,
            maxLength: 100,
          },
          id: {
            dataType: "bytes",
            fieldNumber: 2,
          },
        },
      }
    },
    rules: {
      type: "object",
      fieldNumber: 4,
      properties: {
        allowedOptions: {
          dataType: "uint32",
          fieldNumber: 1,
          minimum: 2,
        },
        quorum: {
          dataType: "uint32",
          fieldNumber: 2,
        },
        minToWin: {
          dataType: "uint32",
          fieldNumber: 3,
        },
      }
    },
    nonce: {
      dataType: "uint64",
      fieldNumber: 5,
    },
    start: {
      dataType: "uint32",
      fieldNumber: 6,
    },
    end: {
      dataType: "uint32",
      fieldNumber: 7,
    },
    actions: {
      type: "array",
      fieldNumber: 8,
      minItems: 0,
      maxItems: 5,
      items: {
        type: "object",
        required: ["moduleID", "reducers",],
        properties: {
          moduleID: {
            dataType: "uint32",
            fieldNumber: 1,
          },
          reducers: {
            dataType: "string",
            fieldNumber: 2,
          },
          params: {
            type: "array",
            fieldNumber: 3,
            minItems: 0,
            items: {
              type: "object",
              required: ["k", "v", "paramType"],
              properties: {
                k: {
                  dataType: 'string',
                  fieldNumber: 1,
                },
                v: {
                  dataType: 'string',
                  fieldNumber: 2
                },
                paramType: {
                  dataType: 'string',
                  fieldNumber: 3,
                  enum: ["string", "uint32", "uint64", "sint64", "boolean", "bytes"],
                }
              }
            }
          },
          acceptor: {
            dataType: "bytes",
            fieldNumber: 4,
            minLength: 20,
            maxLength: 20,
          }
        }
      }
    }
  }
}

export const voteSchema = {
  $id: "lisk/dao/vote",
  type: "object",
  required: ["dao", "proposal", "options"],
  properties: {
    dao: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    proposal: {
      dataType: "bytes",
      fieldNumber: 2,
    },
    options: {
      type: "array",
      fieldNumber: 3,
      minItems: 1,
      items: {
        type: "object",
        required: ["option", "value"],
        properties: {
          option: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          value: {
            dataType: "uint32",
            fieldNumber: 2,
          }
        }
      }
    }
  }
}

export const acceptActionSchema = {
  $id: "lisk/dao/acceptAction",
  type: "object",
  required: ["dao", "proposal"],
  properties: {
    dao: {
      dataType: "bytes",
      fieldNumber: 1,
    },
    proposal: {
      dataType: "bytes",
      fieldNumber: 2,
    },
  }
}