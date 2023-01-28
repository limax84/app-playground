import {createSlice} from '@reduxjs/toolkit'
import * as directSaleContractDefPolygon from './polygon/CryptoTattooerzTokenDirectSale-polygon.json'
import * as directSaleContractDefMumbai from './mumbai/JarvixTokenDirectSale-mumbai.json'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '137': directSaleContractDefPolygon,
  '80001': directSaleContractDefMumbai
}

export interface DirectSaleContractState {
}

const initialState: DirectSaleContractState = {}

const directSaleContractSlice = createSlice({
  name: 'directSaleContract',
  initialState,
  reducers: {}
})

export default directSaleContractSlice.reducer

// Token Direct Sale Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class DirectSaleContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

  getState(rootState: RootState): any {
    return rootState.directSaleContract
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let DIRECT_SALE_CONTRACT: DirectSaleContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_DIRECT_SALE_CONTRACT = (jsonRpcProvider: any | null, chainId: string): DirectSaleContract =>
  DIRECT_SALE_CONTRACT ?
    DIRECT_SALE_CONTRACT :
    (DIRECT_SALE_CONTRACT = new DirectSaleContract(jsonRpcProvider, chainId))
