import * as mumbaiContract from './mumbai/AllowanceHandler-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class AllowanceHandlerContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let ALLOWANCE_HANDLER_CONTRACT: AllowanceHandlerContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_ALLOWANCE_HANDLER_CONTRACT = (jsonRpcProvider: any | null, chainId: string): AllowanceHandlerContract =>
  ALLOWANCE_HANDLER_CONTRACT ?
    ALLOWANCE_HANDLER_CONTRACT :
    (ALLOWANCE_HANDLER_CONTRACT = new AllowanceHandlerContract(jsonRpcProvider, chainId))
