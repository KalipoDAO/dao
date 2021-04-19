import { BaseAsset } from 'lisk-sdk';
import {
  createDao,
  getAllDaos,
  addDao,
} from "../daoAsset";
import {createDaoSchema} from "../index";

export class CreateDao extends BaseAsset {
  name = "createDao";
  id = 0;
  schema = createDaoSchema;

  validate = async ({}) => {

  }

  apply = async ({ asset, stateStore, reducerHandler, transaction }) => {
    const senderAccount = await stateStore.account.get(transaction.senderAddress);


  }
}