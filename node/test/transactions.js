import { TransactionBuilder } from "./utils";

const tb = new TransactionBuilder('http://localhost:3502/api/', 'ws://localhost:3501/ws');

const run = async () => {
  await tb.connect();
  try {
    await (await tb
      .setPassphrase("test")
      .setModuleAssetId(6666, 100)
      .setAssets({username: "test"})
      .sign()).broadcast()
  } catch (e) {
    console.log(e)
  }
  try {
    await (await tb
      .setPassphrase("test123")
      .setModuleAssetId(6666, 100)
      .setAssets({username: "test123"})
      .sign()).broadcast()
  } catch (e) {
    console.log(e)
  }
  try {
    await (await tb
      .setPassphrase("test1")
      .setModuleAssetId(6666, 100)
      .setAssets({username: "test1"})
      .sign()).broadcast()
  } catch (e) {
    console.log(e)
  }
  return 0
}

run()