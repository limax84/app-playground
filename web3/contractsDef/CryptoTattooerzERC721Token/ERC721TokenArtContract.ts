import * as mumbaiContract from './mumbai/JarvixERC721TokenManual-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class ERC721TokenArtContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let ERC721_TOKEN_ART_CONTRACT: ERC721TokenArtContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_ERC721_TOKEN_ART_CONTRACT = (jsonRpcProvider: any | null, chainId: string): ERC721TokenArtContract =>
  ERC721_TOKEN_ART_CONTRACT ?
    ERC721_TOKEN_ART_CONTRACT :
    (ERC721_TOKEN_ART_CONTRACT = new ERC721TokenArtContract(jsonRpcProvider, chainId))
