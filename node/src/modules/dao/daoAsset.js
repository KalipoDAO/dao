import {codec, cryptography} from 'lisk-sdk';
import {daoAssetSchema} from "./schema";

const CHAIN_STATE_DAOS = "dao:registeredDaos";

const getDaoId = (name) => cryptography.hash(new Buffer.from(name))

const createDao = (assets) => {
  const id = getDaoId(assets.name);
  return {
    id,
    ...assets,
  }
}

const findDao = async (stateStore, daoName) => {
  const registeredDaoBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_DAOS}:${getDaoId(daoName)}`,
  );

  if (!registeredDaoBuffer) {
    return false;
  }

  return codec.decode(
    daoAssetSchema,
    registeredDaosBuffer,
  );
}

const updateDao = async (stateStore, dao) => {
  const foundDao = await findDao(stateStore, dao.name)
  if (!foundDao) {
    addDao(stateStore, dao)
  }
  if (!dao.id) {
    dao = createDao({...dao})
  }

  await stateStore.chain.set(
    `${CHAIN_STATE_DAOS}:${dao.id}`,
    codec.encode(daoAssetSchema, {
      ...foundDao,
      ...dao,
    }),
  )
}

const addDao = async (stateStore, dao) => {
  const foundDao = await findDao(stateStore, dao.name)
  if (foundDao) {
    updateDao(stateStore, dao)
  }
  if (!dao.id) {
    dao = createDao({...dao})
  }

  await stateStore.chain.set(
    `${CHAIN_STATE_DAOS}:${dao.id}`,
    codec.encode(daoAssetSchema, {
      id: dao.id,
      name: dao.name,
      nonce: BigInt(0),
      members: [...dao.members],
      rules: {
        ...dao.rules,
      }
    })
  )
}

export {
  CHAIN_STATE_DAOS,
  createDao,
  findDao,
  addDao,
  updateDao,
  getDaoId,
}