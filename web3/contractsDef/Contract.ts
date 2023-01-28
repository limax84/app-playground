import {ethers} from 'ethers';
import {Slice} from '@reduxjs/toolkit';
import {RootState} from '../../utils/redux';

// BASE Contract SINGLETON Class
//////////////////////////////////////////////////////////////////////////////////
export default abstract class Contract {

  // Contract definition
  def: any = {}

  // Contract instance
  contract: ethers.Contract | undefined

  // Contract Roles
  roles: any[] | undefined

  // Contract data slice
  slice: Slice | undefined

  protected constructor(def: any, provider: any | null) {
    this.def = def
    if (!this.def.contractAddress || this.def.contractAddress?.length <= 0)
      console.log('Creating contract with empty address')
    this.contract = new ethers.Contract(this.def.contractAddress, this.def.contractArtifact.abi, provider as any)
  }

  getState(rootState: RootState): any {
  }

}
