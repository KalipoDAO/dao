import {BaseAsset} from 'lisk-sdk';
import {findDaoById,} from "../daoAsset";
import {voteSchema} from "../index";
import {findProposalById, updateVotes} from "../proposalAsset";
import {isDaoMember} from "../utils";

export class Vote extends BaseAsset {
  name = "vote";
  id = 2;
  schema = voteSchema;

  apply = async ({asset, stateStore, transaction}) => {
    const senderAccount = await stateStore.account.get(transaction.senderAddress);
    const foundDao = await findDaoById(stateStore, asset.dao)
    if (!foundDao) {
      throw new Error(`DAO couldn't be found with id: ${asset.dao.toString('hex')}.`);
    }

    const foundMember = isDaoMember(foundDao, transaction.senderAddress)
    const foundProposal = await findProposalById(stateStore, asset.proposal)
    if (!foundProposal) {
      throw new Error(`Proposal couldn't be found with id: ${asset.proposal.toString('hex')}.`);
    }

    if (foundMember.nonce > foundProposal.nonce) {
      throw new Error(`Your not allowed to vote for this proposal, wait for the next proposal.`);
    }

    const lastHeight = stateStore.chain.lastBlockHeaders[0].height;
    if (foundProposal.start > lastHeight) {
      throw new Error(`Voting is not open yet, current height: ${lastHeight} voting opens at ${foundProposal.start}`);
    }
    if (foundProposal.end < lastHeight) {
      throw new Error(`Voting is already closed, current height: ${lastHeight} voting closed at ${foundProposal.end}`);
    }

    if (foundProposal.votes &&
      foundProposal.votes.length > 0 &&
      foundProposal.votes.find(v => v.member.equals(transaction.senderAddress))) {
      throw new Error(`You already voted for this proposal.`);
    }

    const optionVotesCount = asset.options.reduce((sum, cur) => sum + parseInt(cur.value), 0)
    if (optionVotesCount === 0) {
      throw new Error(`You didn't selected any option(s).`);
    }
    if (optionVotesCount > foundProposal.rules.allowedOptions) {
      throw new Error(`You selected to many vote options '${optionVotesCount}' selected where '${foundProposal.rules.allowedOptions}' allowed.`);
    }

    asset.options = asset.options.map(option => {
      if (!foundProposal.options.find(o => o.id.equals(option.option))) {
        throw new Error(`You selected an unknown option with id: ${option.option.toString('hex')}`);
      }
      return {
        id: option.option,
        value: option.value,
        valueType: option.valueType || "count"
      }
    })

    await updateVotes(stateStore, asset.proposal, asset, transaction.senderAddress)
  }
}