import * as mumbaiContract from './mumbai/TokenDataHandlerArt-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class TokenData_Art_Contract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let CONTRACT: TokenData_Art_Contract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_TOKEN_DATA_ART_CONTRACT = (jsonRpcProvider: any | null, chainId: string): TokenData_Art_Contract =>
  CONTRACT ?
    CONTRACT :
    (CONTRACT = new TokenData_Art_Contract(jsonRpcProvider, chainId))
