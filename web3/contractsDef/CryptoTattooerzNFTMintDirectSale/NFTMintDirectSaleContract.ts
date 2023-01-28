import {createSlice} from '@reduxjs/toolkit'
import * as directSaleContractDefMumbai from './mumbai/JarvixNFTMintDirectSale-mumbai.json'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': directSaleContractDefMumbai
}

export interface NFTMintDirectSaleContractState {
}

const initialState: NFTMintDirectSaleContractState = {}

const nftMintDirectSaleContractSlice = createSlice({
  name: 'nftMintDirectSaleContract',
  initialState,
  reducers: {}
})

export default nftMintDirectSaleContractSlice.reducer

// NFT mint Direct Sale Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class NFTMintDirectSaleContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

  getState(rootState: RootState): any {
    return rootState.nftMintDirectSaleContract
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let NFT_MINT_DIRECT_SALE_CONTRACT: NFTMintDirectSaleContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_NFT_MINT_DIRECT_SALE_CONTRACT = (jsonRpcProvider: any | null, chainId: string): NFTMintDirectSaleContract =>
  NFT_MINT_DIRECT_SALE_CONTRACT ?
    NFT_MINT_DIRECT_SALE_CONTRACT :
    (NFT_MINT_DIRECT_SALE_CONTRACT = new NFTMintDirectSaleContract(jsonRpcProvider, chainId))
