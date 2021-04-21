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

  console.log("Create dao 1", await tb
    .setModuleAssetId(3500, 0)
    .setAssets({
      name: "first",
      members: [],
      rules: {}
    })
    // .validateSchema()
    .send('test')
  )
  console.log("Create dao 2", await tb
    .setModuleAssetId(3500, 0)
    .setAssets({
      name: "second",
      members: [],
      rules: {}
    })
    // .validateSchema()
    .send('test1')
  )

  await tb.wait(0)

  console.log('Create proposal', await tb
    .setModuleAssetId(3500, 1)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      description: "Test proposal 1",
      nonce: BigInt(0),
      start: 6,
      end: 60,
      options: [],
      rules: {},
      actions: [],
    })
    // .validateSchema()
    .send('test')
  )

  console.log('Create proposal with action', await tb
    .setModuleAssetId(3500, 1)
    .setAssets({
      dao: new Buffer.from('16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4', 'hex'),
      description: "Test proposal add 'test'",
      nonce: BigInt(0),
      start: 6,
      end: 60,
      options: [],
      rules: {},
      actions: [
        {
          module: "dao",
          reducers: "addMember",
          params: [
            {k: "address", v: 'c14ff30999c0d33fc2eff45b09ffee7b4c4a3527', paramType: 'bytes'},
            {k: "daoId", v: "16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4", paramType: 'bytes'},
            {k: "nonce", v: "1", paramType: 'uint64'},
            {k: "isDao", v: "false", paramType: 'boolean'},
          ],
          acceptor: new Buffer.from('c14ff30999c0d33fc2eff45b09ffee7b4c4a3527', 'hex'),
          condition: {
            option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d', 'hex'),
            operator: "win"
          }
        }
      ],
    })
    // .validateSchema()
    .send('test1')
  )

  console.log('Create proposal non member', await tb
    .setModuleAssetId(3500, 1)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      description: "Test proposal 2",
      nonce: BigInt(0),
      start: 10,
      end: 60,
      options: [],
      rules: {},
      actions: [],
    })
    // .validateSchema()
    .send('test1')
  )

  await tb.wait(0)

  console.log('Vote early', await tb
    .setModuleAssetId(3500, 2)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      proposal: new Buffer.from('5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e', 'hex'),
      options: [
        {
          option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d', 'hex'),
          value: BigInt(1),
        },
      ]
    })
    .send('test')
  )

  await tb.wait(2)

  console.log('Vote wrong option', await tb
    .setModuleAssetId(3500, 2)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      proposal: new Buffer.from('5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e', 'hex'),
      options: [
        {
          option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3e', 'hex'),
          value: BigInt(1),
        },
      ]
    })
    .send('test')
  )

  console.log('Vote more options', await tb
    .setModuleAssetId(3500, 2)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      proposal: new Buffer.from('5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e', 'hex'),
      options: [
        {
          option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d', 'hex'),
          value: BigInt(1),
        },
        {
          option: new Buffer.from('9390298f3fb0c5b160498935d79cb139aef28e1c47358b4bbba61862b9c26e59', 'hex'),
          value: BigInt(1),
        },
      ]
    })
    .send('test')
  )

  console.log('Vote', await tb
    .setModuleAssetId(3500, 2)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      proposal: new Buffer.from('5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e', 'hex'),
      options: [
        {
          option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d', 'hex'),
          value: BigInt(1),
        },
      ]
    })
    .send('test')
  )

  await tb.wait(0)

  console.log('Vote already', await tb
    .setModuleAssetId(3500, 2)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      proposal: new Buffer.from('5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e', 'hex'),
      options: [
        {
          option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d', 'hex'),
          value: BigInt(1),
        },
      ]
    })
    .send('test')
  )

  console.log('Vote non member', await tb
    .setModuleAssetId(3500, 2)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      proposal: new Buffer.from('5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e', 'hex'),
      options: [
        {
          option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d', 'hex'),
          value: BigInt(1),
        },
      ]
    })
    .send('test1')
  )

  console.log('Accept without actions', await tb
    .setModuleAssetId(3500, 3)
    .setAssets({
      dao: new Buffer.from('a7937b64b8caa58f03721bb6bacf5c78cb235febe0e70b1b84cd99541461a08e', 'hex'),
      proposal: new Buffer.from('5cc2eb31a569fd3ead0e1d10ad766eb0ce75d56f24b9fcb08f9aeee4505c938e', 'hex'),
    })
    .send('test')
  )


  await tb.wait(0)

  console.log('Accept action before voting is done', await tb
    .setModuleAssetId(3500, 3)
    .setAssets({
      dao: new Buffer.from('16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4', 'hex'),
      proposal: new Buffer.from('065bade9a9e5da20a5445ee3aeb9cea6c702633b98128b81463d97827d823f88', 'hex'),
    })
    .send('test')
  )

  console.log('Vote member', await tb
    .setModuleAssetId(3500, 2)
    .setAssets({
      dao: new Buffer.from('16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4', 'hex'),
      proposal: new Buffer.from('065bade9a9e5da20a5445ee3aeb9cea6c702633b98128b81463d97827d823f88', 'hex'),
      options: [
        {
          option: new Buffer.from('8a798890fe93817163b10b5f7bd2ca4d25d84c52739a645a889c173eee7d9d3d', 'hex'),
          value: BigInt(1),
        },
      ]
    })
    .send('test1')
  )
  await tb.wait(0)
  console.log('Accept action wrong acceptor', await tb
    .setModuleAssetId(3500, 3)
    .setAssets({
      dao: new Buffer.from('16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4', 'hex'),
      proposal: new Buffer.from('065bade9a9e5da20a5445ee3aeb9cea6c702633b98128b81463d97827d823f88', 'hex'),
    })
    .send('test1')
  )

  console.log('Accept action all votes done', await tb
    .setModuleAssetId(3500, 3)
    .setAssets({
      dao: new Buffer.from('16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4', 'hex'),
      proposal: new Buffer.from('065bade9a9e5da20a5445ee3aeb9cea6c702633b98128b81463d97827d823f88', 'hex'),
    })
    .send('test')
  )

  await tb.wait(0)

  console.log('Accept already resolved', await tb
    .setModuleAssetId(3500, 3)
    .setAssets({
      dao: new Buffer.from('16367aacb67a4a017c8da8ab95682ccb390863780f7114dda0a0e0c55644c7c4', 'hex'),
      proposal: new Buffer.from('065bade9a9e5da20a5445ee3aeb9cea6c702633b98128b81463d97827d823f88', 'hex'),
    })
    .send('test')
  )


  console.log(await tb.callAction('dao:getAllDaos', {offset: 0, limit: 10}))


}

run()
// process.exit()
