import * as mumbaiContract from './mumbai/Allowance4MintHandler-mumbai.json'
import Contract from '../Contract'

// Contract DEFINITIONS by Network CHAIN ID
const contractDefs: { [chainId: string]: any } = {
  '80001': mumbaiContract
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export class Allowance4MintContract extends Contract {

  constructor(jsonRpcProvider: any | null, chainId: string) {
    super(contractDefs[chainId], jsonRpcProvider)
  }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let ALLOWANCE_4_MINT_CONTRACT: Allowance4MintContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_ALLOWANCE_4_MINT_CONTRACT = (jsonRpcProvider: any | null, chainId: string): Allowance4MintContract =>
  ALLOWANCE_4_MINT_CONTRACT ?
    ALLOWANCE_4_MINT_CONTRACT :
    (ALLOWANCE_4_MINT_CONTRACT = new Allowance4MintContract(jsonRpcProvider, chainId))
