import { BaseModule } from 'lisk-sdk';
import { CreateDao } from "./transactions";

export class DaoModule extends BaseModule {
  name = 'dao';
  id = 3500;
  transactionAssets = [
    new CreateDao(),
  ];
  accountSchema = {
    type: "object",
    required: ["owned", "member"],
    properties: {
      owned: {
        type: "array",
        fieldNumber: 1,
        minItems: 0,
        items: {
          dataType: "bytes",
        }
      },
      member: {
        type: "array",
        fieldNumber: 2,
        minItems: 0,
        items: {
          dataType: "bytes",
        }
      }
    },
    default: {
      owned: [],
      member: [],
    }
  }

  actions = {
    // getAllDaos: async () => getAllDaosAsJSON(this._dataAccess),
    // getVotes: async ({dao, offset, limit}) => getVotes(this._dataAccess, dao, offset, limit),
    // getMembers: async ({dao, offset, limit}) => getMembers(this._dataAccess, dao, offset, limit),
    // getFullDao: async ({dao}) => getMembers(this._dataAccess, dao),
  }

  reducers = {
    // addMember: async (params, stateStore) => addMember({params, stateStore}),
    // removeMember: async (params, stateStore) => removeMember({params, stateStore}),
    // updateRule: async (params, stateStore) => updateRule({params, stateStore}),
  }
}