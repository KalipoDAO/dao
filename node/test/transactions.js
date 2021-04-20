import {TransactionBuilder} from "./utils.js";

const accounts = [
  {passphrase: 'test', username: 'test'},
  {passphrase: 'test123', username: 'test123'},
  {passphrase: 'test1', username: 'test1'},
]

const tb = new TransactionBuilder('http://localhost:3502/api/', 'ws://localhost:3501/ws', accounts);

const run = async () => {
  await tb.connect();
  await tb
    .setModuleAssetId(6666, 100)
    .setAssets({username: "test"})
    .send('test')

  await tb
    .setModuleAssetId(6666, 100)
    .setAssets({username: "test123"})
    .send('test123')

await tb
    .setModuleAssetId(6666, 100)
    .setAssets({username: "test1"})
    .send('test1')

  await tb.wait(0)

  console.log(await tb
    .setModuleAssetId(3500, 0)
    .setAssets({
      name: "first",
      members: [],
      rules: {}
    })
    // .validateSchema()
    .send('test')
  )

  await tb.wait(0)

  console.log('Create proposal', await tb
    .setModuleAssetId(3500, 1)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      description: "Test proposal 1",
      nonce: BigInt(0),
      start: 60,
      end: 120,
      options: [],
      rules: {},
      actions: [],
    })
      // .validateSchema()
    .send('test')
  )

  console.log(await tb.callAction('dao:getAllDaos', {offset: 0, limit: 10}))



}

run()
// process.exit()
