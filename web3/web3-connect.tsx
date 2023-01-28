import {useI18n} from '#/utils/language'
import {useIsMounted} from '#/web3/useMounted'
import {useAccount, useConnect} from 'wagmi'
import Button from '#/ui/Button'
import React from 'react'
import {Boundary} from '#/ui/Boundary';

const I18N = {
  connection: {en: 'Connection', fr: 'Connexion'},
  alreadyConnected: {en: 'Already connected', fr: 'Déjà connecté'},
  selectWallet: {en: 'Select your Wallet', fr: 'Choisissez votre Wallet'},
  unsupported: {en: 'unsupported', fr: 'non supporté'},
  connecting: {en: 'connecting', fr: 'connexion'},
}

export const Web3Connect = () => {

  const i18n = useI18n(I18N)
  const isMounted = useIsMounted()
  const {isConnected} = useAccount()
  const {connect, connectors, error, isLoading, pendingConnector} = useConnect()

  // Rendering
  // -------------------------------------------------------------------------------------------------------------------
  return (
    <div className="flex flex-col gap-8">

      <h1 id="TITLE" className="text-xl font-medium text-gray-400/80">{i18n.connection}</h1>

      <Boundary labels={[i18n.selectWallet]}>
        {isMounted && isConnected ?
          (<>
            <div>{i18n.alreadyConnected}</div>
          </>) :
          (<>
            <div id="BUTTONS" className={'flex flex-col gap-4 lg:flex-row'}>
              {isMounted && connectors.map((connector) => (
                <Button
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={() => connect({connector})}
                >
                  {connector.name}
                  {!connector.ready && (' (' + i18n.unsupported + ')')}
                  {isLoading && connector.id === pendingConnector?.id && (' (' + i18n.connecting + '...)')}
                </Button>
              ))}
            </div>

            {error && <div>{error.message}</div>}
          </>)
        }
      </Boundary>

    </div>
  )
}
