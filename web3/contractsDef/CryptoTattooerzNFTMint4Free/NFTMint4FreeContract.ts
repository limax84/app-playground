import {createSlice} from '@reduxjs/toolkit'
import * as directSaleContractDefMumbai from './mumbai/JarvixERC721TokenAutoMinter-mumbai.json'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': directSaleContractDefMumbai
}

export interface NFTMint4FreeContractState {
}

const initialState: NFTMint4FreeContractState = {}

const nftMint4FreeContractSlice = createSlice({
  name: 'nftMint4FreeContract',
  initialState,
  reducers: {}
})

export default nftMint4FreeContractSlice.reducer

// NFT mint 4 Free Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class NFTMint4FreeContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

  getState(rootState: RootState): any {
    return rootState.nftMint4FreeContract
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let NFT_MINT_4_FREE_CONTRACT: NFTMint4FreeContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_NFT_MINT_4_FREE_CONTRACT = (jsonRpcProvider: any | null, chainId: string): NFTMint4FreeContract =>
  NFT_MINT_4_FREE_CONTRACT ?
    NFT_MINT_4_FREE_CONTRACT :
    (NFT_MINT_4_FREE_CONTRACT = new NFTMint4FreeContract(jsonRpcProvider, chainId))
