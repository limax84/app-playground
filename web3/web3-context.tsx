'use client'

import React, {useEffect} from 'react'
import {useProvider, WagmiConfig} from 'wagmi'
import {wagmiClient} from '#/web3/web3-config';
import {Block} from '#/web3/block/Block';
import {Event} from '#/web3/event/Event';
import {initBlocksFromStorage, saveBlocksToStorage, watchBlocks} from '#/web3/block/Blocks';
import {arraysEqual, removeDuplicates} from '#/utils/utils';

// TYPE of the Context
// ---------------------------------------------------------------------------------
export type IWeb3Context = {
  ready: boolean, setReady: React.Dispatch<React.SetStateAction<boolean>>,
  blocks: Block[], setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
  events: Event[], setEvents: React.Dispatch<React.SetStateAction<Event[]>>
} | undefined

// CONTEXT
// ---------------------------------------------------------------------------------
export const Web3Context = React.createContext<IWeb3Context | undefined>(undefined)

// PROVIDER
// ---------------------------------------------------------------------------------
export const Web3Provider = ({children}: { children: React.ReactNode }) => {

  const [ready, setReady] = React.useState<boolean>(false)
  const [blocks, setBlocks] = React.useState<Block[]>([])
  const [events, setEvents] = React.useState<Event[]>([])

  const provider = useProvider()

  // Init Blocks
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!ready) {
      initBlocksFromStorage({setBlocks} as IWeb3Context)
      setReady(true)
    }
  }, [])

  // Clean Blocks on changes
  // ----------------------------------------------------------------
  useEffect(() => {
    setBlocks((oldBlocks: Block[]) => {
      const newBlocks =
        removeDuplicates(oldBlocks, (a: Block, b: Block) => a.number === b.number)
          .sort((a: Block, b: Block) => b.number - a.number)
      if (arraysEqual(oldBlocks, newBlocks))
        return oldBlocks
      saveBlocksToStorage(newBlocks)
      return newBlocks
    })
  }, [blocks])

  // // Watch Blocks
  // // --------------------------------------------------------------
  // useEffect(() => {
  //   if (ready) {
  //     const unwatchBlocks = watchBlocks(provider, {setBlocks} as IWeb3Context)
  //     return () => unwatchBlocks()
  //   }
  // }, [ready])

  // Clean Events on changes
  // ----------------------------------------------------------------
  useEffect(() => {
    setEvents((oldEvents: Event[]) => {
      const eventEquals = (a: Event, b: Event) =>
        a.timestamp === b.timestamp &&
        a.signature == b.signature
      const newEvents =
        removeDuplicates(oldEvents, eventEquals)
          .sort((a: Event, b: Event) => b.timestamp - a.timestamp)
      if (!arraysEqual(oldEvents, newEvents))
        return newEvents
      return oldEvents

    })
  }, [events])

  return (
    <WagmiConfig client={wagmiClient}>
      <Web3Context.Provider value={{ready, setReady, blocks, setBlocks, events, setEvents}}>
        {children}
      </Web3Context.Provider>
    </WagmiConfig>
  )
}

// USE Context
// ---------------------------------------------------------------------------------
export function useWeb3Context() {
  const context = React.useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3Context must be used within a Web3Provider')
  }
  return context
}
