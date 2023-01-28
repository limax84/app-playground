import * as mumbaiContract from './mumbai/WhitelistHandler-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class WhitelistHandlerContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let WHITELIST_HANDLER_CONTRACT: WhitelistHandlerContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_WHITELIST_HANDLER_CONTRACT = (jsonRpcProvider: any | null, chainId: string): WhitelistHandlerContract =>
  WHITELIST_HANDLER_CONTRACT ?
    WHITELIST_HANDLER_CONTRACT :
    (WHITELIST_HANDLER_CONTRACT = new WhitelistHandlerContract(jsonRpcProvider, chainId))
