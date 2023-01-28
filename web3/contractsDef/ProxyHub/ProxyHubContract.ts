import {createSlice} from '@reduxjs/toolkit'
import * as proxyHubContractDefMumbai from './mumbai/ProxyHub-mumbai.json'
import Contract from '../Contract'
import {RootState} from '../../../utils/redux'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': proxyHubContractDefMumbai
}

export interface ProxyHubContractState {
}

const initialState: ProxyHubContractState = {}

const proxyHubContractSlice = createSlice({
  name: 'proxyHubContract',
  initialState,
  reducers: {}
})

export default proxyHubContractSlice.reducer

// Proxy Hub Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class ProxyHubContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

  getState(rootState: RootState): any {
    return rootState.proxyHubContract
  }
}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let PROXY_HUB_CONTRACT: ProxyHubContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_PROXY_HUB_CONTRACT = (jsonRpcProvider: any | null, chainId: string): ProxyHubContract =>
  PROXY_HUB_CONTRACT ?
    PROXY_HUB_CONTRACT :
    (PROXY_HUB_CONTRACT = new ProxyHubContract(jsonRpcProvider, chainId))
