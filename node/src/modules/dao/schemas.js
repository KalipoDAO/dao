
export const daoAssetSchema = {
  $id: "lisk/dao",
  type: "object",
  required: ["daos"],
  properties: {
    daos: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ['id', 'name', 'nonce', 'members', ],
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
            default: 0,
          },
          members: {
            type: "array",
            fieldNumber: 4,
            minItems: 1,
            items: {
              type: "object",
              required: ['address', 'nonce'],
              properties: {
                address: {
                  dataType: "bytes",
                  fieldNumber: 1,
                  minLength: 20,
                  maxLength: 20,
                },
                nonce: {
                  dataType: "uint64",
                  fieldNumber: 2,
                },
                isOwner: {
                  dataType: "uin32",
                  fieldNumber: 3,
                },
              }
            }
          },
          proposals: {
            type: 'array',
            fieldNumber: 5,
            items: {
              type: "object",
              required: [],
              properties: {
                creator: {
                  dataType: "bytes",
                  fieldNumber: 1,
                  minLength: 20,
                  maxLength: 20,
                },
                description: {
                  dataType: "bytes",
                  fieldNumber: 2,
                  minLength: 5,
                  maxLength: 140,
                },
                options: {
                  type: "array",
                  fieldNumber: 3,
                  items: {
                    type: "object",
                    required: ['label', 'id'],
                    minItems: 2,
                    maxItems: 10,
                    properties: {
                      label: {
                        dataType: "string",
                        fieldNumber: 1,
                        minLength: 1,
                        maxLength: 100,
                      },
                      id: {
                        dataType: "bytes",
                        fieldNumber: 2, // TODO: length
                      },
                    }
                  }
                },
                rules: {
                  type: "object",
                  fieldNumber: 4,
                  required: ['allowedOptions', 'binaryVote', 'quorum', 'minToWin'],
                  properties: {
                    allowedOptions: {
                      dataType: "uint32",
                      fieldNumber: 1,
                    },
                    binaryVote: {
                      dataType: "uint32",
                      fieldNumber: 2,
                    },
                    quorum: {
                      dataType: "uint32",
                      fieldNumber: 3,
                    },
                    minToWin: {
                      dataType: "uint32",
                      fieldNumber: 4,
                    },
                  }
                },
                nonce: {
                  dataType: "uint32",
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
                  items: {
                    type: "object",
                    required: ['moduleID', 'reducers', 'params'],
                    properties: {
                      moduleID: {
                        dataType: "uin32",
                        fieldNumber: 1,
                      },
                      reducers: {
                        dataType: "string",
                        fieldNumber: 2,
                      },
                      params: {
                        dataType: "object",
                        fieldNumber: 3,
                      }
                    }
                  }
                }
              }
            }
          },
          history: {
            type: "array",
            fieldNumber: 6,
            items: {
              type: 'object',
              required: ['txId'],
              properties: {
                txId: {
                  dataType: "bytes",
                  fieldNumber: 1,
                }
              }
            }
          }
        }
      }
    }
  }
}