'use client'

import {useAccount, useBalance, useDisconnect, useNetwork, useSwitchNetwork} from 'wagmi'
import {useIsMounted} from '#/web3/useMounted'

import Button from '#/ui/Button'
import Address from '#/ui/Address'
import {useI18n} from '#/utils/language'
import {Web3Connect} from '#/web3/web3-connect'
import {toast} from 'react-toastify'
import {Boundary} from '#/ui/Boundary'

const I18N = {
  connectedTo: {en: 'Connected to', fr: 'Connecté à'},
  connectToWallet: {en: 'Connect your Wallet', fr: 'Connectez votre Wallet'},
  balanceFetched: {en: 'Balance fetched', fr: 'Solde récupéré'},
  disconnect: {en: 'Disconnect', fr: 'Déconnexion'},
  account: {en: 'Account', fr: 'Compte'},
  network: {en: 'Network', fr: 'Réseau'},
  reload: {en: 'Reload', fr: 'Recharger'},
  reloading: {en: 'Reloading', fr: 'Rechargement'},
  switching: {en: 'Switching', fr: 'Changement'},
}

export default function Page() {

  const i18n = useI18n(I18N)
  const isMounted = useIsMounted()
  const {address, connector, isConnected} = useAccount()
  const {disconnect} = useDisconnect()

  const balance = useBalance({
    address,
    onSuccess: data => toast.info('Balance fetched: ' + Number.parseFloat(data?.formatted || '0').toFixed(3) + ' ' + data?.symbol)
  })

  const {chain} = useNetwork()
  const {chains, error: errorSwitchNetwork, isLoading: isSwitchingNetwork, pendingChainId, switchNetwork} = useSwitchNetwork()

  return isMounted && isConnected && address ? (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-medium text-gray-400/80">{i18n.connectedTo} {connector?.name}</h1>

      <Boundary labels={[i18n.account]}>
        <div className="flex flex-col gap-4">
          <div>
            <Address>{address}</Address>
            <Button disabled={false} className={'ml-4'} onClick={() => disconnect()}>{i18n.disconnect}</Button>
          </div>
          {balance.isLoading ?
            (<div>Fetching balance…</div>) :
            balance.isError ?
              (<div>Error fetching balance</div>) :
              (<div>
                Balance: {Number.parseFloat(balance.data?.formatted || '0').toFixed(3)} {balance.data?.symbol}
                {balance.isRefetching ?
                  (<Button className={'ml-4'}>{i18n.reloading}...</Button>) :
                  (<Button className={'ml-4'} onClick={() => balance.refetch()}>{i18n.reload}</Button>)
                }
              </div>)}
        </div>
      </Boundary>

      <Boundary labels={[i18n.network]}>
        <div className="flex flex-col gap-4">
          {chain && <div>{i18n.connectedTo} {chain.name}</div>}

          <div className={'flex gap-4'}>
            {chains.map((x: any, i: number) => (
              <Button
                disabled={!switchNetwork || x.id === chain?.id}
                onClick={() => switchNetwork?.(x.id)}
                key={i}
              >
                {x.name}
                {isSwitchingNetwork && pendingChainId === x.id && ' (' + i18n.switching + '...)'}
              </Button>
            ))}
          </div>

          <div>{errorSwitchNetwork && errorSwitchNetwork.message}</div>
        </div>
      </Boundary>

    </div>
  ) : (
    <Web3Connect/>
  )

}
