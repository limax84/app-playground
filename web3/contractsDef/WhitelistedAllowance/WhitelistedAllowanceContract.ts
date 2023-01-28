import * as mumbaiContract from './mumbai/WhitelistedHandlerAllowanceProxy-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class WhitelistedAllowanceContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let WHITELISTED_ALLOWANCE_CONTRACT: WhitelistedAllowanceContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_WHITELISTED_ALLOWANCE_CONTRACT = (jsonRpcProvider: any | null, chainId: string): WhitelistedAllowanceContract =>
  WHITELISTED_ALLOWANCE_CONTRACT ?
    WHITELISTED_ALLOWANCE_CONTRACT :
    (WHITELISTED_ALLOWANCE_CONTRACT = new WhitelistedAllowanceContract(jsonRpcProvider, chainId))
