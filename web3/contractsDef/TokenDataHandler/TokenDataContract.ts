import * as mumbaiContract from './mumbai/TokenDataHandler-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class TokenDataContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let CONTRACT: TokenDataContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_TOKEN_DATA_CONTRACT = (jsonRpcProvider: any | null, chainId: string): TokenDataContract =>
  CONTRACT ?
    CONTRACT :
    (CONTRACT = new TokenDataContract(jsonRpcProvider, chainId))
