import {BaseAsset} from 'lisk-sdk';
import {addDao, createDao, findDao,} from "../daoAsset";
import {createDaoSchema} from "../index";

export class CreateDao extends BaseAsset {
  name = "createDao";
  id = 0;
  schema = createDaoSchema;

  apply = async ({asset, stateStore, reducerHandler, transaction}) => {
    const senderAccount = await stateStore.account.get(transaction.senderAddress);
    const senderAddress = transaction.senderAddress.toString('hex')
    const foundDao = await findDao(stateStore, asset.name)
    if (foundDao) {
      throw new Error(`DAO with ${asset.name} already exist.`);
    }

    const dao = createDao({
      ...asset,
      nonce: BigInt(0),
      members: [
        ...asset.members.filter(m => m.id === senderAddress).map(m => ({
          id: new Buffer.from(m.id, 'hex'),
          nonce: BigInt(0),
          isDao: m.isDao || false,
          isOwner: false,
        })),
        {
          id: transaction.senderAddress,
          nonce: BigInt(0),
          isDao: false,
          isOwner: true,
        }
      ],
      rules: {
        quorum: asset.rules.quorum || 50,
        freeQuorum: asset.rules.freeQuorum || false,
        minQuorum: asset.rules.minQuorum || 50,
      }
    });

    senderAccount.dao.owned.push(dao.id);
    // TODO: update dao.member[] all members from dao creation
    await stateStore.account.set(transaction.senderAddress, senderAccount);
    await addDao(stateStore, dao);
  }
}