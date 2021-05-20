const allowedModules = [
  {
    module: "dao",
    reducers: [
      "addMember", "removeMember",
    ]
  },
]

export const isAllowedAction = (action) => {
  // todo check member already is in
  const allowedModule = allowedModules.find(am => am.module === action.module);
  return allowedModule || allowedModule.reducers.find(r => r === action.reducers)
}

export const isDaoMember = (dao, sender) => {
  const foundMember = dao.members.find(m => {
    return m.id.equals(sender)
  });
  if (!foundMember) {
    throw new Error(`You are not a member of the DAO with id: ${dao.id.toString('hex')}.`);
  }
  if (foundMember.removedAt) {
    throw new Error(`You are not a member of the DAO with id: ${dao.id.toString('hex')} anymore.`);
  }
  return foundMember
}

export const allVoted = (proposal, dao) => {
  const eligibleMembers = dao.members.filter(m => m.nonce <= proposal.nonce && m.removedAt === 0).length;
  const votedMembers = proposal.votes.length;
  return eligibleMembers === votedMembers
}

export const isQuorumReached = (votes, quorum, eligibleCount) => {
  return votes > (quorum / 100) * eligibleCount
}

export const getWinningOption = (proposal, dao) => {
  const eligibleMembers = dao.members.filter(m => m.nonce <= proposal.nonce && m.removedAt === 0).length;
  const votedMembers = proposal.votes.length;
  if (!isQuorumReached(votedMembers, proposal.rules.quorum, eligibleMembers)) {
    return false;
  }
  const totalVotePoints = votedMembers * proposal.rules.allowedOptions;
  const absoluteMinToWin = (proposal.rules.minToWin / 100) * totalVotePoints;
  const cumulativePerVote = proposal.options.map(option => ({
    id: option.id, count: proposal.votes
      .map(v => v.options)
      .flat()
      .filter(v =>  v.id.equals(option.id))
      .reduce((sum, vote) => vote.valueType === "count" ?
          parseInt(sum) + parseInt(vote.value) :
          BigInt(sum) + BigInt(vote.value),
        0)
  }))

  let winningOption = null;
  cumulativePerVote.sort((a, b) => a.count - b.count).map(vote => {
    if (absoluteMinToWin < vote.count) {
      winningOption = vote.id
    }
  })
  return winningOption;
}

export const parseParam = (value, type) => {
  switch (type) {
    case 'string':
      return value
    case 'uint32':
      return parseInt(value)
    case 'uint64':
      return BigInt(value)
    case 'sint64':
      return BigInt(value)
    case 'boolean':
      return (value === 'true')
    case 'bytes':
      return new Buffer.from(value, 'hex')
    default:
      return value;
  }
}