import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Mainnet, DAppProvider, useEtherBalance, useEthers, Goerli, AvalancheTestnet, Avalanche } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { getDefaultProvider } from 'ethers'


const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet'),
    [Goerli.chainId]: getDefaultProvider('goerli'),
    [AvalancheTestnet.chainId]: 'https://api.avax-test.network/ext/C/rpc',
    [Avalanche.chainId]: 'https://api.avax.network/ext/bc/C/rpc'
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
)
