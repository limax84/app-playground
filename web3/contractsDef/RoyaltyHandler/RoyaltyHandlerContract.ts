import * as mumbaiContract from './mumbai/RoyaltyHandler-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class RoyaltyHandlerContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let CONTRACT: RoyaltyHandlerContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_ROYALTY_HANDLER_CONTRACT = (jsonRpcProvider: any | null, chainId: string): RoyaltyHandlerContract =>
  CONTRACT ?
    CONTRACT :
    (CONTRACT = new RoyaltyHandlerContract(jsonRpcProvider, chainId))
