import ERC20Contract from '../../ERC20Contract'
import * as linkContractDefPolygon from './polygon/ERC20_LINK-polygon.json'
import * as linkContractDefMumbai from './mumbai/ERC20_LINK-mumbai.json'

const contractDefs: { [chainId: string]: any } = {
    '137': linkContractDefPolygon,
    '80001': linkContractDefMumbai
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class LINKContract extends ERC20Contract {

    static SYMBOL: string = 'LINK'

    constructor(jsonRpcProvider: any | null, chainId: string) {
        super(contractDefs[chainId], jsonRpcProvider)
        this.addCurrency(LINKContract.SYMBOL);
    }

}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let LINK_CONTRACT: LINKContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_LINK_CONTRACT = (jsonRpcProvider: any | null, chainId: string): LINKContract | undefined =>
    LINK_CONTRACT ?
        LINK_CONTRACT :
        (LINK_CONTRACT = !contractDefs[chainId] ? undefined : new LINKContract(jsonRpcProvider, chainId))
