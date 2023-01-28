import {createSlice} from '@reduxjs/toolkit'
import * as directSaleContractDefMumbai from './mumbai/JarvixNFTMintDirectSaleWL-mumbai.json'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': directSaleContractDefMumbai
}

export interface NFTMint_WL_DirectSaleContractState {
}

const initialState: NFTMint_WL_DirectSaleContractState = {}

const nftMint_WL_DirectSaleContractSlice = createSlice({
  name: 'nftMint_WL_DirectSaleContract',
  initialState,
  reducers: {}
})

export default nftMint_WL_DirectSaleContractSlice.reducer

// NFT mint 4 WL Direct Sale Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class NFTMint_WL_DirectSaleContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

  getState(rootState: RootState): any {
    return rootState.nftMint_WL_DirectSaleContract
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let NFT_MINT_WL_DIRECT_SALE_CONTRACT: NFTMint_WL_DirectSaleContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_NFT_MINT_WL_DIRECT_SALE_CONTRACT = (jsonRpcProvider: any | null, chainId: string): NFTMint_WL_DirectSaleContract =>
  NFT_MINT_WL_DIRECT_SALE_CONTRACT ?
    NFT_MINT_WL_DIRECT_SALE_CONTRACT :
    (NFT_MINT_WL_DIRECT_SALE_CONTRACT = new NFTMint_WL_DirectSaleContract(jsonRpcProvider, chainId))
