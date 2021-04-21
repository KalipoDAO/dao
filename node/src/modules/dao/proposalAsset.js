import {codec, cryptography} from 'lisk-sdk';
import {
  daoProposalsStoreSchema,
  proposalAssetSchema,
  proposalsStoreSchema
} from "./schema";

const CHAIN_STATE_DAO_PROPOSAL = "dao:proposalDao"
const CHAIN_STATE_PROPOSAL = "dao:proposal";
const CHAIN_STATE_PROPOSALS = "dao:proposals";

const getProposalId = (daoId, nonce) => {
  const nonceBuffer = Buffer.alloc(8);
  nonceBuffer.writeBigInt64LE(nonce);
  const seed = Buffer.concat([daoId, nonceBuffer]);
  return cryptography.hash(seed)
}

const createProposal = (assets, daoId) => {
  const id = getProposalId(daoId, assets.nonce);
  return {
    id,
    ...assets,
  }
}

const getAllProposalsByDao = async (stateStore, daoId, action = false) => {
  const allProposalsBuffer = action ?
    await stateStore.getChainState(`${CHAIN_STATE_DAO_PROPOSAL}:${daoId}`) :
    await stateStore.chain.get(`${CHAIN_STATE_DAO_PROPOSAL}:${daoId}`)
  if (!allProposalsBuffer) {
    return {proposals: []}
  }
  return codec.decode(
    daoProposalsStoreSchema,
    allProposalsBuffer,
  )
}

const getAllProposalsByDaoAsJSON = async (stateStore, {id, offset, limit}) => {
  const allProposals = await getAllProposalsByDao(stateStore, id, true)
  const proposalsJson = codec.toJSON(daoProposalsStoreSchema, {proposals: allProposals.proposals.slice(offset, limit)})
  const fullProposals = await Promise.all(proposalsJson.proposals.map(async proposal => (await getProposal(stateStore, proposal.id))))

  return {
    meta: {
      count: proposalsJson && proposalsJson.proposals && proposalsJson.proposals.length || 0,
      limit: limit || 100,
      offset: offset || 0,
    },
    data: fullProposals,
  }
}

const getAllProposals = async (stateStore, action = false) => {
  const allProposalsBuffer = action ?
    await stateStore.getChainState(CHAIN_STATE_PROPOSALS) :
    await stateStore.chain.get(CHAIN_STATE_PROPOSALS)
  if (!allProposalsBuffer) {
    return {proposals: []}
  }
  return codec.decode(
    proposalsStoreSchema,
    allProposalsBuffer,
  )
}

const getAllProposalsAsJSON = async (stateStore, {offset, limit}) => {
  const allProposals = await getAllProposals(stateStore, true)
  const proposalsJson = codec.toJSON(proposalsStoreSchema, {proposals: allProposals.proposals.slice(offset, limit)})
  const fullProposals = await Promise.all(proposalsJson.proposals.map(async proposal => (await getProposal(stateStore, proposal.id))))
  return {
    meta: {
      count: proposalsJson.proposals && proposalsJson.proposals.length || 0,
      limit: limit || 100,
      offset: offset || 0,
    },
    data: fullProposals,
  }
}

const getProposal = async (stateStore, id) => {
  const proposalBuffer = await stateStore.getChainState(
    `${CHAIN_STATE_PROPOSAL}:${id}`,
  )
  if (!proposalBuffer) {
    return {}
  }

  return codec.toJSON(proposalAssetSchema, codec.decode(
    proposalAssetSchema,
    proposalBuffer,
  ))
}

const findProposal = async (stateStore, daoId, nonce) => {
  const proposalBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_PROPOSAL}:${getProposalId(daoId, nonce)}`,
  );

  if (!proposalBuffer) {
    return false;
  }

  return codec.decode(
    proposalAssetSchema,
    proposalBuffer,
  );
}

const findProposalById = async (stateStore, proposalId) => {
  const proposalBuffer = await stateStore.chain.get(
    `${CHAIN_STATE_PROPOSAL}:${proposalId.toString('hex')}`,
  );

  if (!proposalBuffer) {
    return false;
  }

  return codec.decode(
    proposalAssetSchema,
    proposalBuffer,
  );
}

const updateProposal = async (stateStore, proposal, daoId) => {
  const foundProposal = await findProposalById(stateStore, proposal.id)
  if (!foundProposal) {
    addProposal(stateStore, proposal, daoId)
  }
  if (!proposal.id) {
    proposal = createProposal(proposal, daoId)
  }

  await stateStore.chain.set(
    `${CHAIN_STATE_PROPOSAL}:${proposal.id.toString('hex')}`,
    codec.encode(proposalAssetSchema, {
      ...foundProposal,
      ...proposal,
    }),
  )
}

const updateVotes = async (stateStore, proposalId, asset, member) => {
  const foundProposal = await findProposalById(stateStore, proposalId)
  if (!foundProposal) {
    throw new Error(`Proposal was not found on the blockchain`);
  }

  const updatedProposal = {
    ...foundProposal,
    votes: [
      ...foundProposal.votes,
      {
        options: asset.options,
        member,
      }
    ]
  }

  await stateStore.chain.set(
    `${CHAIN_STATE_PROPOSAL}:${proposalId.toString('hex')}`,
    codec.encode(proposalAssetSchema, updatedProposal),
  )
}

const resolveProposal = async (stateStore, proposalId) => {
  const foundProposal = await findProposalById(stateStore, proposalId)
  if (!foundProposal) {
    throw new Error(`Proposal was not found on the blockchain`);
  }

  const updatedProposal = {
    ...foundProposal,
    state: "resolved"
  }

  await stateStore.chain.set(
    `${CHAIN_STATE_PROPOSAL}:${proposalId.toString('hex')}`,
    codec.encode(proposalAssetSchema, updatedProposal),
  )
}

const addProposal = async (stateStore, proposal, daoId) => {
  const foundProposal = await findProposalById(stateStore, proposal.id)
  if (foundProposal) {
    updateProposal(stateStore, proposal, daoId)
  }
  if (!proposal.id) {
    proposal = createProposal(proposal, daoId)
  }

  const allProposals = await getAllProposals(stateStore);
  allProposals.proposals.push({
    id: proposal.id,
    daoId: daoId,
  })


  await stateStore.chain.set(
    CHAIN_STATE_PROPOSALS,
    codec.encode(proposalsStoreSchema, allProposals)
  )

  const allDaoProposals = await getAllProposalsByDao(stateStore, daoId);
  allDaoProposals.proposals.push({
    id: proposal.id,
    nonce: proposal.nonce,
  })

  await stateStore.chain.set(
    `${CHAIN_STATE_DAO_PROPOSAL}:${daoId.toString('hex')}`,
    codec.encode(daoProposalsStoreSchema, allDaoProposals)
  )

  await stateStore.chain.set(
    `${CHAIN_STATE_PROPOSAL}:${proposal.id.toString('hex')}`,
    codec.encode(proposalAssetSchema, {
      id: proposal.id,
      creator: proposal.creator,
      description: proposal.description,
      options: proposal.options,
      rules: proposal.rules,
      nonce: BigInt(proposal.nonce),
      start: proposal.start,
      end: proposal.end,
      actions: proposal.actions,
      state: proposal.state,
      votes: [],
    })
  )


}

export {
  CHAIN_STATE_PROPOSALS,
  CHAIN_STATE_PROPOSAL,
  CHAIN_STATE_DAO_PROPOSAL,
  findProposalById,
  findProposal,
  addProposal,
  updateProposal,
  getProposalId,
  createProposal,
  getAllProposals,
  getAllProposalsAsJSON,
  getAllProposalsByDaoAsJSON,
  getProposal,
  getAllProposalsByDao,
  updateVotes,
  resolveProposal,
}