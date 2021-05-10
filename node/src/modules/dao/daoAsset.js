import {codec, cryptography} from 'lisk-sdk';
import {daoAssetSchema, daosStoreSchema} from "./schema";

const CHAIN_STATE_DAO = "dao";
const CHAIN_STATE_DAOS = "dao:registeredDaos";

const getDaoId = (name) => cryptography.hash(new Buffer.from(name))

const createDao = (assets) => {
  const id = getDaoId(assets.name);
  return {
    id,
    ...assets,
  }
}

const getAllDaos = async (stateStore, action = false) => {
  const allDaosBuffer = action ?
    await stateStore.getChainState(CHAIN_STATE_DAOS) :
    await stateStore.chain.get(CHAIN_STATE_DAOS)
  if (!allDaosBuffer) {
    return {daos: []}
  }
  return codec.decode(
    daosStoreSchema,
    allDaosBuffer,
  )
}

const getAllDaosAsJSON = async (stateStore, {offset, limit}) => {
  const allDaos = await getAllDaos(stateStore, true)
  const daoJson = codec.toJSON(daosStoreSchema, {daos: allDaos.daos.slice(offset, limit)})
  const fullDaos = await Promise.all(daoJson.daos.map(async dao => (await getDao(stateStore, dao.id))))
  return {
    meta: {
      count: daoJson.daos && daoJson.daos.length || 0,
      limit: limit || 100,
      offset: offset || 0,
    },
    data: fullDaos,
  }
}

const getDao = async (stateStore, id) => {
  const daoBuffer = await stateStore.getChainState(
    `${CHAIN_STATE_DAO}:${id}`,
  )

  if (!daoBuffer) {
    return {}
  }

  return codec.toJSON(daoAssetSchema, codec.decode(
    daoAssetSchema,
    daoBuffer,
  ))
}

const findDao = async (stateStore, daoName) => {
  const registeredDaoBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_DAO}:${getDaoId(daoName).toString('hex')}`,
  );

  if (!registeredDaoBuffer) {
    return false;
  }

  return codec.decode(
    daoAssetSchema,
    registeredDaoBuffer,
  );
}

const findDaoById = async (stateStore, daoId) => {
  const registeredDaoBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_DAO}:${daoId.toString('hex')}`,
  );

  if (!registeredDaoBuffer) {
    return false;
  }

  return codec.decode(
    daoAssetSchema,
    registeredDaoBuffer,
  );
}

const addDaoToAccount = async (stateStore, {daoId, address}) => {
  const account = await stateStore.account.get(address);
  account.dao.member.push(daoId)
  await stateStore.account.set(address, account);
}

const addMember = async (stateStore, {daoId, address, nonce, isDao}) => {
  const foundDao = await findDaoById(stateStore, daoId)
  if (!foundDao) {
    throw new Error(`Dao not found ${daoId}`);
  }
  await stateStore.chain.set(
    `${CHAIN_STATE_DAO}:${daoId.toString('hex')}`,
    codec.encode(daoAssetSchema, {
      ...foundDao,
      members: [
        ...foundDao.members,
        {
          id: address,
          nonce,
          isDao: !!isDao,
          isOwner: false,
          removedAt: 0,
        }
      ]
    }),
  )
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
    `${CHAIN_STATE_DAO}:${dao.id.toString('hex')}`,
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
  const allDaos = await getAllDaos(stateStore);
  allDaos.daos.push({
    id: dao.id,
    name: dao.name,
  })
  await stateStore.chain.set(
    CHAIN_STATE_DAOS,
    codec.encode(daosStoreSchema, allDaos)
  )

  await stateStore.chain.set(
    `${CHAIN_STATE_DAO}:${dao.id.toString('hex')}`,
    codec.encode(daoAssetSchema, {
      id: dao.id,
      name: dao.name,
      nonce: BigInt(0),
      members: [...dao.members],
      rules: {
        ...dao.rules,
      },
      description: dao.description,
    })
  )
}

export {
  CHAIN_STATE_DAOS,
  createDao,
  findDao,
  findDaoById,
  addDao,
  updateDao,
  getDaoId,
  getAllDaosAsJSON,
  getDao,
  getAllDaos,
  addMember,
  addDaoToAccount,
}