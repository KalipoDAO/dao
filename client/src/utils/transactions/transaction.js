/* global BigInt */
import {codec, transactions} from "@liskhq/lisk-client";
import {getFullAssetSchema} from "../common";

export const createTransaction = async ({
                                          moduleId,
                                          assetId,
                                          account,
                                          assets,
                                          client,
                                        }) => {

  const {publicKey, address} = account;
  let chainAccount
  try {
    chainAccount = await client.invoke("app:account:get", {address: new Buffer.from(address, 'hex')});
  } catch (e) {
    if (moduleId === 6666) {
      chainAccount = {
        sequence: {
          nonce: 0,
        }
      }
    }
  }

  const transactionObject = {
    moduleID: moduleId,
    assetID: assetId,
    nonce: BigInt(chainAccount?.sequence?.nonce),
    fee: BigInt(transactions.convertLSKToBeddows('0.01')),
    senderPublicKey: publicKey,
    asset: {
      ...assets
    }
  }
  const assetSchema = client.schemas.transactionsAssets
    .find(s => s.moduleID === moduleId && s.assetID === assetId)
  console.log(client.schemas.transactionsAssets, assetSchema)
  const schema = assetSchema.schema;
  const fee = transactions.computeMinFee(schema, transactionObject)
  console.log(client._nodeInfo.networkIdentifier)
  const signedTransaction = transactions.signTransaction(
    schema,
    {...transactionObject, fee},
    new Buffer.from(client._nodeInfo.networkIdentifier, 'hex'),
    account.passphrase.join(" "),
  )
  console.log(signedTransaction)
  const {id, ...rest} = signedTransaction;
  console.log(codec)
  let result = {
    status: false,
    message: null,
  };
  try {
    result.status = true;
    result.message = await client.transaction.send(codec.codec.fromJSON(getFullAssetSchema(schema), rest))
  } catch ({message}) {
    result.status = false;
    result.message = message;
  }
  console.log(result)
  return result;
}