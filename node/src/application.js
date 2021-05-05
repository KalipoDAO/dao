import {ExtendedAPIPlugin} from "./plugins";
import {Application, configDevnet, genesisBlockDevnet, HTTPAPIPlugin, utils,} from 'lisk-sdk';
import {SprinklerModule} from "@moosty/lisk-sprinkler"
import { DaoModule} from "./modules";
import {DPoSModule, KeysModule, SequenceModule, TokenModule} from "lisk-framework";

genesisBlockDevnet.header.asset.accounts = genesisBlockDevnet.header.asset.accounts
  .map(a => utils.objects.mergeDeep({}, a, {
    sprinkler: {
      username: ""
    },
    dao: {
      owned: [],
      member: [],
    }
  }
));
genesisBlockDevnet.header.timestamp = 1618824790;

const customConfig = {
  label: 'dao',
  genesisConfig: {
    communityIdentifier: 'LCUDAO',
    blockTime: 5,
  },
  logger: {
    consoleLogLevel: 'debug',
  },
  rpc: {
    enable: true,
    port: 3501,
    mode: 'ws',
  },
  network: {
    port: 3500,
  },
  plugins: {
    httpApi: {
      whiteList: ["127.0.0.1"],
      port: 3502,
    },
    ExtendedHTTPAPI: {
      port: 3503,
    }
  }
};

const appConfig = utils.objects.mergeDeep({}, configDevnet, customConfig);

const app = new Application(genesisBlockDevnet, appConfig);

app._registerModule(SprinklerModule, false);
app._registerModule(TokenModule, false);
app._registerModule(SequenceModule, false);
app._registerModule(KeysModule, false);
app._registerModule(DPoSModule, false);
app._registerModule(DaoModule, false);

app.registerPlugin(HTTPAPIPlugin);
app.registerPlugin(ExtendedAPIPlugin);

export {
  customConfig as AppConfig,
  app as App
}