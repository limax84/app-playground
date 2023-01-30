'use client'

import React from 'react'
import {watchContractEvent} from '@wagmi/core'
import {Event} from '#/web3/event/Event'
import {processEvent} from '#/web3/event/event-utils'
import {IWeb3Context, Web3Context} from '#/web3/web3-context'

// USE Events
// ---------------------------------------------------------------------------------
export function useEvents() {
  const context = React.useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useEvents must be used within a Web3Provider')
  }
  return [context.events, context.setEvents]
}

// LOAD Events
// ---------------------------------------------------------------------------------
export function loadEvents(
  eventNames: string[],
  contract: { queryFilter: any },
  provider: any,
  web3Context: IWeb3Context
) {
  return Promise.all(eventNames.map((eventName: string) => {
    const maxBlockNumber: number = web3Context?.events && web3Context?.events.length > 0 ?
      Math.max(...web3Context?.events.map(e => e.blockNumber)) : 0
    return contract.queryFilter(eventName, maxBlockNumber)
      .then((rawEvents: any) => Promise.all(rawEvents.map((rawEvent: any) => processEvent(rawEvent, provider, web3Context)))
        .then((processedEvents: Event[]) => {
          console.log('Events [' + eventName + '] LOADED : ', processedEvents)
          return web3Context?.setEvents((oldEvents: Event[]) => [...oldEvents].concat(processedEvents))
        })
      )
  }))
}

// WATCH Events
// ---------------------------------------------------------------------------------
export function watchEvents(
  eventNames: string[],
  testContractDef: { contractAddress: any, contractArtifact: { abi: any } },
  provider: any,
  web3context: IWeb3Context
) {
  return eventNames.map((eventName: string) => watchContractEvent({
      address: testContractDef.contractAddress,
      abi: testContractDef.contractArtifact.abi,
      eventName: eventName,
    },
    async (node: any, label: any, rawEvent: any) => {
      console.log('# Event [' + eventName + '] received! Message: [' + label + ']', 'Raw event: ', rawEvent)
      const processedEvent: Event = await processEvent(rawEvent, provider, web3context)
      console.log('# Event PROCESSED Tsp: ', processedEvent.timestamp)
      web3context?.setEvents((oldEvents: Event[]) => {
        const newEvents = [...oldEvents]
        newEvents.push(processedEvent)
        console.log('# New event added! [TOTAL: ' + newEvents.length + ']')
        return newEvents
      })
    },
  ))

}
