import { codec, cryptography } from 'lisk-sdk';
import { daoAssetSchema } from "./schema";

const CHAIN_STATE_DAOS = "dao:registeredDaos";

const createDao = ({assets, creator}) => {
  const nameBuffer = new Buffer.from(assets.name);
  const seed = Buffer.concat([creator.address, nameBuffer])
  const id = cryptography.hash(seed);

  return {
    id,
    creator,
    assets,
  }
}

export {
  CHAIN_STATE_DAOS,
  createDao,
}