import {TransactionBuilder} from "./utils.js";

const accounts = [
  {passphrase: 'test', username: 'test'},
  {passphrase: 'test123', username: 'test123'},
  {passphrase: 'test1', username: 'test1'},
]

const tb = new TransactionBuilder('http://localhost:3502/api/', 'ws://localhost:3501/ws', accounts);
const run = async () => {
  await tb.connect();
  console.log(await tb.callAction('dao:getAllDaos', {offset: 0, limit: 10}))
  console.log(await tb.callAction('dao:getDao', {id: "a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e"}))
  console.log(await tb.callAction('dao:getAllProposals', {offset: 0, limit: 10}))
  console.log(await tb.callAction('dao:getAllProposalsByDao', {offset: 0, limit: 10, id: "a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e"}))
  console.log(await tb.callAction('dao:getProposal', {id: "5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e"}))
  console.log(await tb.callAction('dao:getProposal', {id: "065bade9a9e5da20a5445ee3aeb9cea6c702633b98128b81463d97827d823f88"}))
  console.log(await tb.callAction('dao:getDao', {id: "16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4"}))


}

run()
