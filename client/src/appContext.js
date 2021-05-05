import React from 'react';
import { apiClient } from "@liskhq/lisk-client"

let client;
const getClient = async (server) => {
  if (!client) {
    client = await apiClient.createWSClient(server)
  }
  return client;
}

const api = {
  server: 'ws://localhost:3501/ws',
  getClient: getClient('ws://localhost:3501/ws')
}

const AppContext = React.createContext({api});

export {
  api,
  AppContext
}