'use client'

import React from 'react'
import {configureChains, createClient, WagmiConfig} from 'wagmi'
import {polygon, polygonMumbai} from 'wagmi/chains'
import {alchemyProvider} from 'wagmi/providers/alchemy'
import {infuraProvider} from 'wagmi/providers/infura'
import {publicProvider} from 'wagmi/providers/public'
import {MetaMaskConnector} from '@wagmi/connectors/metaMask';
import {CoinbaseWalletConnector} from '@wagmi/connectors/coinbaseWallet';
import {WalletConnectConnector} from '@wagmi/connectors/walletConnect';
import {InjectedConnector} from '@wagmi/connectors/injected';

// Config CHAINS & PROVIDERS
// ========================================================

// ALCHEMY RPC NODE APP Key
const RPC_NODE_APP_KEY_ALCHEMY: string = 'ufHdTt5whbUh_2THpDRRWbnUi3cVorC8'
// INFURA RPC NODE APP Key
const RPC_NODE_APP_KEY_INFURA: string = '75e0f0e1d0c740479fd1c8e9de768bbe'

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
// see. https://wagmi.sh/react/providers/configuring-chains
const {chains, provider, webSocketProvider} = configureChains(
  [
    polygon,
    polygonMumbai
  ],
  [
    alchemyProvider({apiKey: RPC_NODE_APP_KEY_ALCHEMY}),
    infuraProvider({apiKey: RPC_NODE_APP_KEY_INFURA}),
    publicProvider()
  ],
  {
    pollingInterval: 2000, // The frequency in milliseconds at which the provider polls. Defaults to 4000
    // targetQuorum: 2, // Sets the target quorum. Defaults to 1
    // minQuorum: 2, // Sets the minimum quorum that must be accepted by the providers. Defaults to 1
    stallTimeout: 5000 // The timeout in milliseconds after which another provider will be attempted
  }
)

// CLIENT Config
// ========================================================

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains}),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Cryptotattooerz.io',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  logger: {
    warn: (str) => console.log(str)
  },
  provider,
  webSocketProvider,
})
