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

  await tb.wait(1)

  console.log(await tb
    .setModuleAssetId(3500, 0)
    .setAssets({
      name: "first",
      members: [],
      rules: {}
    })
    .send('test')
  )

}

run()
// process.exit()
