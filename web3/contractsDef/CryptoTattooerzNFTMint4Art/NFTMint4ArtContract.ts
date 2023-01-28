import {createSlice} from '@reduxjs/toolkit'
import * as directSaleContractDefMumbai from './mumbai/JarvixERC721TokenManualMinter-mumbai.json'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': directSaleContractDefMumbai
}

export interface NFTMint4ArtContractState {
}

const initialState: NFTMint4ArtContractState = {}

const nftMint4ArtContractSlice = createSlice({
  name: 'nftMint4ArtContract',
  initialState,
  reducers: {}
})

export default nftMint4ArtContractSlice.reducer

// NFT mint 4 Art Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class NFTMint4ArtContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

  getState(rootState: RootState): any {
    return rootState.nftMint4ArtContract
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let NFT_MINT_4_ART_CONTRACT: NFTMint4ArtContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_NFT_MINT_4_ART_CONTRACT = (jsonRpcProvider: any | null, chainId: string): NFTMint4ArtContract =>
  NFT_MINT_4_ART_CONTRACT ?
    NFT_MINT_4_ART_CONTRACT :
    (NFT_MINT_4_ART_CONTRACT = new NFTMint4ArtContract(jsonRpcProvider, chainId))
