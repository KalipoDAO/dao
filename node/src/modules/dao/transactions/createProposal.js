import {BaseAsset, cryptography} from 'lisk-sdk';
import {findDao, findDaoById, updateDao,} from "../daoAsset";
import {createProposalSchema} from "../index";
import {addProposal, createProposal} from "../proposalAsset";
import {isAllowedAction, isDaoMember} from "../utils";

export class CreateProposal extends BaseAsset {
  name = "createProposal";
  id = 1;
  schema = createProposalSchema;

  apply = async ({asset, stateStore, transaction}) => {
    const senderAccount = await stateStore.account.get(transaction.senderAddress);
    const foundDao = await findDaoById(stateStore, asset.dao)
    if (!foundDao) {
      throw new Error(`DAO couldn't be found with id: ${asset.dao.toString('hex')}.`);
    }

    isDaoMember(foundDao, transaction.senderAddress)

    if (!asset.options || asset.options.length === 0) {
      asset.options = [
        {label: "yes", id: cryptography.hash(new Buffer.from('yes'))},
        {label: "no", id: cryptography.hash(new Buffer.from('no'))},
      ]
      asset.rules.binaryVote = true
    }
    if (asset.options && asset.options.length > 1) {
      asset.options = asset.options.map((option, i) => ({
        ...option,
        id: option.id || Buffer.alloc(4).writeInt32LE(0)
      }))
    }
    asset.rules.minToWin = asset.rules.minQuorum;
    asset.rules.allowedOptions = asset.rules.allowedOptions || 1
    delete asset.rules.minQuorum;
    if (foundDao.rules && !foundDao.rules.freeQuorum) {
      asset.rules.quorum = foundDao.rules.quorum
      asset.rules.minToWin = foundDao.rules.minQuorum
    }

    if (asset.actions) {
      asset.actions.map(action => {
        if (!isAllowedAction(action)) {
          throw new Error(`Action module: ${action.module}, reducers: ${action.reducers} is not allowed.`);
        }
        if (action.module === "dao" && action.reducers === "addMember") {
          const nonce = action.params.find(p => p.k === "nonce");
          if (!nonce) {
            throw new Error(`Nonce for new member is required`)
          }
          if (BigInt(nonce.v) <= foundDao.nonce) {
            throw new Error(`Your not allowed to add a user now and act it was the passed`)
          }
        }
      })
    }

    const daoId = new Buffer.from(asset.dao, 'hex');
    const proposal = createProposal({
      creator: senderAccount.address,
      description: asset.description,
      options: [
        ...asset.options,
      ],
      rules: {
        ...asset.rules,
      },
      nonce: BigInt(foundDao.nonce),
      start: asset.start, // todo check minimum blocks current time
      end: asset.end,
      state: "unresolved",
      actions: [
        ...asset.actions,
      ],
      dao: foundDao.id,
    }, daoId);

    await updateDao(stateStore, {...foundDao, nonce: BigInt(foundDao.nonce) + BigInt(1)})
    await addProposal(stateStore, proposal, daoId);
  }
}