import Contract from './Contract';
import {RootState} from '../../utils/redux';
import {encodeString} from '../../utils/helpers/utils';

export const CURRENCIES = Object.fromEntries(['COIN', 'TOKEN', 'NFT'].map((currency: string) =>
  [encodeString(currency), currency]
))

// BASE ERC20 Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default abstract class ERC20Contract extends Contract {

  // Token decimals promise
  decimals: Promise<number> | undefined

  protected constructor(def: any, provider: any | null) {
    super(def, provider)
    this.decimals = this.contract?.decimals()
  }
  addCurrency(currency: string) {
    if(CURRENCIES[encodeString(currency)] == null) {
      CURRENCIES[encodeString(currency)] = currency;
    }
  }

  getState(rootState: RootState): any {
    return {}
  }
}
