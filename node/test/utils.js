/* global BigInt */
import {codec, cryptography, transactions, apiClient, utils} from "lisk-sdk";
import fetch from 'node-fetch'

export const fetchApi = async (api, endpoint, filters) => {
  const response = await fetch(`${api}${endpoint}`);
  const data = await response.json();
  return data.data;
}

export const getFullAssetSchema = assetSchema => utils.objects.mergeDeep({}, baseAssetSchema, { properties: { asset: assetSchema },});

export class TransactionBuilder {
  constructor(api, ws) {
    this.ws = ws;
    this.api = api;
  }

  connect = async () => {
    await this.getClient()
    await this.getNodeInfo()
  }

  getClient = async () => {
    this.wsClientCache = await apiClient.createWSClient(this.ws);
  }

  getNodeInfo = async () => {
    const nodeInfo = await fetchApi(this.api, 'node/info');
    this.networkIdentifier = Buffer.from(nodeInfo.networkIdentifier, "hex")
    this.genesisConfig = nodeInfo.genesisConfig;
    this.registeredModules = nodeInfo.registeredModules;
  }

  setPassphrase(phrase) {
    this.passphrase = phrase;
    this.keys = cryptography.getPrivateAndPublicKeyFromPassphrase(
      this.passphrase
    );

    this.address = cryptography.getAddressFromPassphrase(this.passphrase).toString('hex');
    return this;
  }

  setModuleAssetId(moduleId, assetId) {
    this.moduleId = moduleId;
    this.assetId = assetId;
    const assetSchema = this.wsClientCache.schemas.transactionsAssets.find(s => s.moduleID === moduleId && s.assetID === assetId)
    this.schema = assetSchema.schema;
    return this;
  }

  setAssets(assets) {
    this.assets = assets;
    return this;
  }

  getNonce = async () => {
    const account = await fetchApi(this.api, `accounts/${this.address}`)
    if (account) {
      return account.sequence.nonce;
    }
    return 0;
  }

  sign = async () => {
    const nonce = await this.getNonce()
    const transactionObject = {
      moduleID: this.moduleId,
      assetID: this.assetId,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows('0.01')),
      senderPublicKey: this.keys.publicKey,
      asset: {
        ...this.assets
      }
    }
    const fee = transactions.computeMinFee(this.schema, transactionObject)
    const signedTransaction = transactions.signTransaction(
      this.schema,
      {...transactionObject, fee},
      this.networkIdentifier,
      this.passphrase
    )
    const {id, ...rest} = signedTransaction;
    this.signedTransaction = codec.fromJSON(getFullAssetSchema(this.schema), rest)
    return this;
  }

  broadcast = async () => {
    return await this.wsClientCache.transaction.send(this.signedTransaction)
  }
}

export const baseAssetSchema = {
  $id: 'lisk/base-transaction',
  type: 'object',
  required: ['moduleID', 'assetID', 'nonce', 'fee', 'senderPublicKey', 'asset'],
  properties: {
    moduleID: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    assetID: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    fee: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
    senderPublicKey: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    asset: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    signatures: {
      type: 'array',
      items: {
        dataType: 'bytes',
      },
      fieldNumber: 7,
    },
  },
};

//
// export const createTransaction = async ({
//                                           moduleId,
//                                           assetId,
//                                           baseFee = '0',
//                                           passphrase,
//                                           fee = null,
//                                           networkIdentifier = '0e45f42f61b3d36399c4832f2e6783be946d557c7c274a11c8fe5c4ddbed84db',
//                                           assets,
//                                           schema,
//                                           nonce = null
//                                         }) => {
//     const {publicKey} = cryptography.getPrivateAndPublicKeyFromPassphrase(
//       passphrase
//     );
//     const address = cryptography.getAddressFromPassphrase(passphrase);
//     if (nonce === null) {
//       const account = await fetchAccountInfo(address.toString("hex"));
//       if (account?.sequence?.nonce) {
//         nonce = account.sequence.nonce;
//       } else {
//         nonce = 0;
//       }
//     }
//     const transactionObject = {
//       moduleID: moduleId,
//       assetID: assetId,
//       nonce: BigInt(nonce),
//       fee: BigInt(transactions.convertLSKToBeddows('0.01')),
//       senderPublicKey: publicKey,
//       asset: {
//         ...assets
//       }
//     }
//     const tx = transactions.signTransaction(
//       schema,
//       transactionObject,
//       Buffer.from(networkIdentifier, "hex"),
//       passphrase
//     );
//     if (fee === null) {
//       const size = tx.getBytes().length;
//       fee = BigInt(1000 * size);
//     }
//
//     if (typeof fee === 'string') {
//       fee = BigInt(transactions.convertLSKToBeddows(fee));
//     }
//
//     const signedTransaction = transactions.signTransaction(
//       schema,
//       {...transactionObject, fee},
//       Buffer.from(networkIdentifier, "hex"),
//       passphrase
//     );
//
//     const {id, ...rest} = signedTransaction;
//     return {
//       id: id.toString("hex"),
//       tx: codec.codec.toJSON(getFullAssetSchema(schema), rest),
//       signedTransaction: signedTransaction,
//     }
//   }
