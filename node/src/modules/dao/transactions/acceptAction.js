import {BaseAsset} from 'lisk-sdk';
import {findDaoById,} from "../daoAsset";
import {acceptActionSchema,} from "../index";
import {findProposalById, resolveProposal} from "../proposalAsset";
import {allVoted, getWinningOption, isAllowedAction, parseParam} from "../utils";

const allowedModules = [
  "dao",
]

export class AcceptAction extends BaseAsset {
  name = "acceptAction";
  id = 3;
  schema = acceptActionSchema;

  apply = async ({asset, stateStore, transaction, reducerHandler}) => {
    const senderAccount = await stateStore.account.get(transaction.senderAddress);
    const foundDao = await findDaoById(stateStore, asset.dao)
    if (!foundDao) {
      throw new Error(`DAO couldn't be found with id: ${asset.dao.toString('hex')}.`);
    }

    const foundProposal = await findProposalById(stateStore, asset.proposal)
    if (!foundProposal) {
      throw new Error(`Proposal couldn't be found with id: ${asset.proposal.toString('hex')}.`);
    }

    if (foundProposal.state === "resolved") {
      throw new Error(`Proposal with id: ${asset.proposal.toString('hex')} is already resolved.`);
    }

    if (foundProposal.votes.length === 0) {
      throw new Error(`Proposal with id: ${asset.proposal.toString('hex')} has no votes yet.`);
    }

    if (foundProposal.actions.length === 0) {
      throw new Error(`Proposal with id: ${asset.proposal.toString('hex')} has no actions to resolve.`);
    }

    const lastHeight = stateStore.chain.lastBlockHeaders[0].height;
    if (lastHeight < foundProposal.end && !allVoted(foundProposal, foundDao)) {
      throw new Error(`Proposal with id: ${asset.proposal.toString('hex')} is not finished yet.`);
    }

    const optionWon = getWinningOption(foundProposal, foundDao);
    if (!optionWon) {
      throw new Error(`Proposal with id: ${asset.proposal.toString('hex')} has no winning option.`);
    }
    await Promise.all(foundProposal.actions.map(async action => {
      if (!isAllowedAction(action)) {
        throw new Error(`Action module: ${action.module}, reducers: ${action.reducers} is not allowed.`);
      }
      if (!action.acceptor.equals(transaction.senderAddress)) {
        throw new Error(`You are not the acceptor for this action.`);
      }

      if (action.condition && (
        (action.condition.operator === "win" && action.condition.option.equals(optionWon)) ||
        (action.condition.operator === "lose" && !action.condition.option.equals(optionWon))
      )) {
        await reducerHandler.invoke(`${action.module}:${action.reducers}`,
          Object.fromEntries(action.params.map(param => [param.k, parseParam(param.v, param.paramType)]))
        )
      }
    }));

    await resolveProposal(stateStore, asset.proposal)
  }
}