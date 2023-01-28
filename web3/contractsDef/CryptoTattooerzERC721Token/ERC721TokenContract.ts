import * as mumbaiContract from './mumbai/JarvixERC721TokenAuto_mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class ERC721TokenContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let ERC721_TOKEN_CONTRACT: ERC721TokenContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_ERC721_TOKEN_CONTRACT = (jsonRpcProvider: any | null, chainId: string): ERC721TokenContract =>
  ERC721_TOKEN_CONTRACT ?
    ERC721_TOKEN_CONTRACT :
    (ERC721_TOKEN_CONTRACT = new ERC721TokenContract(jsonRpcProvider, chainId))
