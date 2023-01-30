'use client'

import React from 'react'
import {Block} from '#/web3/block/Block'
import {DateTime} from 'luxon';
import {formatDt} from '#/utils/utils';
import {FetchBlockNumberResult, watchBlockNumber} from '@wagmi/core';
import {IWeb3Context, Web3Context} from '#/web3/web3-context';

// USE Blocks
// ---------------------------------------------------------------------------------
export function useBlocks() {
  const context = React.useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useBlocks must be used within a Web3Provider')
  }
  return [context.blocks, context.setBlocks]
}

// WATCH Blocks
// ---------------------------------------------------------------------------------
export const watchBlocks = (provider: any, web3Context: IWeb3Context) =>
  watchBlockNumber({listen: true},
    async (blockNumber: FetchBlockNumberResult) => {
      const rawBlock: any = await provider.getBlock(blockNumber)
      const block: Block = processBlock(rawBlock)
      addBlock(block, web3Context)
    }
  )

export const getBlock = async (blockNumber: number, provider: any, web3Context: IWeb3Context) => {
  const block = web3Context?.blocks.find((b: Block) => b.number === blockNumber)
  if (block)
    return block
  const rawBlock = await provider.getBlock(blockNumber)
  console.log('>>> getBlock(' + blockNumber + '): from BLOCKCHAIN')
  const processedBlock = processBlock(rawBlock)
  addBlock(processedBlock, web3Context)
  return processedBlock
}

export const addBlock = (block: Block, web3Context: IWeb3Context) =>
  web3Context?.setBlocks((oldBlocks: Block[]) => {
    if (oldBlocks.find((oldBlock: Block) => oldBlock.number === block.number))
      return oldBlocks
    const newBlocks = [...oldBlocks]
    newBlocks.push(block)
    return newBlocks
  })

export const addBlocks = (blocks: Block[], web3Context: IWeb3Context) =>
  web3Context?.setBlocks((oldBlocks: Block[]) => {
    const blocksToAdd = blocks.filter((block: Block) => !oldBlocks.find((oldBlock: Block) => oldBlock.number === block.number))
    if (!blocksToAdd || blocksToAdd.length === 0)
      return oldBlocks
    return [...oldBlocks].concat(blocksToAdd)
  })

export const initBlocksFromStorage = (web3Context: IWeb3Context) => {
  const blocks: Block[] = JSON.parse(localStorage.getItem('blocks') || '[]')
  if (blocks && blocks.length > 0) {
    console.log('# Init Blocks from local STORAGE (' + blocks.length + ')', blocks)
    addBlocks(blocks, web3Context)
  }
}

export const saveBlocksToStorage = (blocks: Block[]) => {
  localStorage.setItem('blocks', JSON.stringify(blocks))
}

export const processBlock = (rawBlock: any): Block => {
  return {
    number: rawBlock.number,
    timestamp: rawBlock.timestamp * 1000
  }
}

const log = true
export const getBlockNumberFromTimestamp = async (provider: any, timestamp: number) => {
  if (log) console.log('>> getBlockNumberFromTimestamp', timestamp,)
  const blockNumberNow = await provider.getBlockNumber();
  if (log) console.log('> blockNumberNow', blockNumberNow)
  const nowTsp = DateTime.now().toMillis()
  const totalDiffInMs = nowTsp - timestamp
  let diffToNowInMs = 0
  let avgBlockTimeInMs = 0
  for (let i = blockNumberNow - 1; i >= 0; i--) {
    const block = await provider.getBlock(i);
    const blockTsp = block.timestamp * 1000
    const diffToTsp = blockTsp - timestamp
    diffToNowInMs = nowTsp - blockTsp
    avgBlockTimeInMs = diffToNowInMs / (blockNumberNow - i)
    if (blockTsp <= timestamp) {
      if (log) console.log('- Block #' + i + ' [' + blockTsp + '] = ' + formatDt(blockTsp),
        'AvgBlockTime=' + (avgBlockTimeInMs / 1000).toFixed(2) + 's',
        'diffToTsp=' + (diffToTsp / 1000).toFixed(2) + 's',)
      return i
    } else {
      const diffNbBlock = Math.floor(diffToTsp / (avgBlockTimeInMs * 1.2))
      if (log) console.log('- Block #' + i + ' [' + blockTsp + '] = ' + formatDt(blockTsp),
        'totalDiffInMs=' + (totalDiffInMs / 1000).toFixed(2) + 's',
        'diffToTsp=' + (diffToTsp / 1000).toFixed(2) + 's',
        'diffToNowInMs=' + (diffToNowInMs / 1000).toFixed(2) + 's',
        'AvgBlockTime=' + (avgBlockTimeInMs / 1000).toFixed(2) + 's',
        'diffNbBlock=' + diffNbBlock)
      i -= diffNbBlock
    }
  }
  throw new Error(`Aucun block n'a été trouvé pour le timestamp ${timestamp}`)
}
