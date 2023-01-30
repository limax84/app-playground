'use client'

import {useAccount, useContract, useProvider} from 'wagmi'
import {useIsMounted} from '#/web3/useMounted'
import {useI18n} from '#/utils/language'
import {Web3Connect} from '#/web3/web3-connect'
import {Boundary} from '#/ui/Boundary'

import testContractDef from '#/web3/contractsDef/InteractionTest/mumbai/InteractionTest-mumbai.json'
import {prepareWriteContract, writeContract} from '@wagmi/core';
import {getRevertErrorMessage} from '#/web3/web3-utils';
import Button from '#/ui/Button';
import {useEffect} from 'react';
import {toast} from 'react-toastify';
import {DateTime} from 'luxon';
import {EventsViewer} from '#/web3/event/EventsViewer';
import {loadEvents, watchEvents} from '#/web3/event/Events';
import {processEvent} from '#/web3/event/event-utils';
import {getBlockNumberFromTimestamp} from '#/web3/block/Blocks';
import {IWeb3Context, useWeb3Context} from '#/web3/web3-context';

const I18N = {
  title: {en: 'Events', fr: 'Evennements'},
  fireEvents: {en: 'Fire Events', fr: 'Lancer des évennements'},
  fireEvent: {en: 'Fire the event', fr: 'Déclencher l\'évennement'}
}

export default function Page() {

  const i18n = useI18n(I18N)
  const isMounted = useIsMounted()
  const {address, isConnected} = useAccount()
  const provider = useProvider()
  const web3context: IWeb3Context = useWeb3Context()

  const testContract = useContract({
    address: testContractDef.contractAddress as any,
    abi: testContractDef.contractArtifact.abi,
    signerOrProvider: provider
  })

  useEffect(() => {
    if (testContract && web3context.ready) {
      loadEvents(['Event_string', 'Event_address', 'Event_bool'], testContract, provider, web3context)
    }
  }, [testContract, web3context.ready])

  useEffect(() => {
    if (web3context.ready) {
      const unwatchEvents = watchEvents(['Event_string', 'Event_address', 'Event_bool'], testContractDef, provider, web3context)
      return () => unwatchEvents.forEach((unwatchEvent: any) => unwatchEvent())
    }
  }, [web3context.ready])

  const write = async (functionName: string, args: any[]): Promise<{ data: any, errorMessage: any }> => {
    let data, errorMessage
    try {
      const config = await prepareWriteContract({
        address: testContractDef.contractAddress as any,
        abi: testContractDef.contractArtifact.abi,
        functionName: functionName,
        args: args,
      })
      data = await writeContract(config)
    } catch (err: any) {
      console.error('ERR', err)
      errorMessage = getRevertErrorMessage(err)
    }
    toast.info('TX Sent! [' + functionName + '(' + args.join(', ') + ')] - Waiting for Event...')
    return {data, errorMessage}
  }

  // RENDER Component
  // -----------------------------------------------------------------------------------------------------
  return isMounted && isConnected && address ? (
    <div className='flex flex-col gap-8'>
      <h1 className='text-xl font-medium text-gray-400/80'>{i18n.title}</h1>
      <Boundary labels={[i18n.fireEvents]}>
        <div className='flex gap-4'>
          <Button onClick={() => write('write_string', [false, 'Manual write on events page'])}>{i18n.fireEvent}</Button>
        </div>
      </Boundary>
      <EventsViewer events={web3context.events} className={'max-h-[40vh]'}/>
    </div>
  ) : (
    <Web3Connect/>
  )
}
