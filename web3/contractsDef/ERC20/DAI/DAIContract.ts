import ERC20Contract from '../../ERC20Contract'
import * as daiContractDefPolygon from './polygon/ERC20_DAI-polygon.json'

const contractDefs: { [chainId: string]: any } = {
    '137': daiContractDefPolygon
}

// Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default class DAIContract extends ERC20Contract {

    static SYMBOL: string = 'DAI'

    constructor(jsonRpcProvider: any | null, chainId: string) {
        super(contractDefs[chainId], jsonRpcProvider)
        this.addCurrency(DAIContract.SYMBOL);
    }
}

// Contract SINGLETON Instance
//////////////////////////////////////////////////////////////////////////////////
let DAI_CONTRACT: DAIContract | undefined

// Contract SINGLETON Instance GETTER
//////////////////////////////////////////////////////////////////////////////////
export const GET_DAI_CONTRACT = (jsonRpcProvider: any | null, chainId: string): DAIContract | undefined =>
    DAI_CONTRACT ?
        DAI_CONTRACT :
        (DAI_CONTRACT = !contractDefs[chainId] ? undefined : new DAIContract(jsonRpcProvider, chainId))
