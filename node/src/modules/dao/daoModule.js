import { BaseModule } from 'lisk-sdk';
import {AcceptAction, CreateDao, CreateProposal, Vote} from "./transactions";
import {addMember, getAllDaosAsJSON, getDao} from "./daoAsset";
import {getAllProposalsAsJSON, getAllProposalsByDaoAsJSON, getProposal} from "./proposalAsset";

export class DaoModule extends BaseModule {
  name = 'dao';
  id = 3500;
  transactionAssets = [
    new CreateDao(),
    new CreateProposal(),
    new Vote(),
    new AcceptAction(),
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
    getAllDaos: async (params) => getAllDaosAsJSON(this._dataAccess, params),
    getDao: async (params) => getDao(this._dataAccess, params.id),
    getAllProposals: async (params) => getAllProposalsAsJSON(this._dataAccess, params),
    getAllProposalsByDao: async (params) => getAllProposalsByDaoAsJSON(this._dataAccess, params),
    getProposal: async (params) => getProposal(this._dataAccess, params.id),
    // getVotes: async ({dao, offset, limit}) => getVotes(this._dataAccess, dao, offset, limit),
    // getMembers: async ({dao, offset, limit}) => getMembers(this._dataAccess, dao, offset, limit),
  }

  reducers = {
    addMember: async (params, stateStore) => addMember(stateStore, params),
    // removeMember: async (params, stateStore) => removeMember({params, stateStore}),
    // updateRule: async (params, stateStore) => updateRule({params, stateStore}),
  }
}