'use client'

import {useAccount} from 'wagmi'
import {useIsMounted} from '#/web3/useMounted'
import {useI18n} from '#/utils/language'
import {Web3Connect} from '#/web3/web3-connect'
import {Boundary} from '#/ui/Boundary'

import testContractDef from '#/web3/contractsDef/InteractionTest/mumbai/InteractionTest-mumbai.json'
import {check, encodeString, stringToBytes32, stringToBytes4} from '#/utils/utils';
import {prepareWriteContract, writeContract} from '@wagmi/core';
import {getRevertErrorMessage, IntegrationTestEnum} from '#/web3/web3-utils';
import Test from '#/app/web3/read/test';
import Button from '#/ui/Button';
import {useRef} from 'react';

const I18N = {
  writeFunctionTests: {en: 'Write function Tests', fr: 'Tests des fonctions d\'écriture'},
  testAll: {en: 'Test all', fr: 'Tester tous'},
  unitTests: {en: 'Atomic tests', fr: 'Tests atomiques'},
}

const getTestWrite = (functionName: string, args: any[]) =>
  async (): Promise<{ data: any, errorMessage: any }> => {
    let data, errorMessage
    try {
      const config = await prepareWriteContract({
        address: testContractDef.contractAddress as any,
        abi: testContractDef.contractArtifact.abi,
        functionName: functionName,
        args: args,
      })
      data = await writeContract(config)
    } catch (err: any) {
      console.error('ERR', err)
      errorMessage = getRevertErrorMessage(err)
    }
    return {data, errorMessage}
  }

export default function Page() {

  const i18n = useI18n(I18N)
  const isMounted = useIsMounted()
  const {address, isConnected} = useAccount()

  const testAll = async () => {
    for (let i = 0; i < WRITE_TEST_FUNCTIONS.length; i++)
      await (WRITE_TEST_FUNCTIONS[i].ref.current as any).runTest()
  }

  const WRITE_TEST_FUNCTIONS = [
    {
      name: 'write_AccessControl (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_AccessControl', [encodeString('expectedRole')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.toLowerCase() === ('Custom Error: AccessControl_MissingRole(' + address + ', ' + encodeString('expectedRole').slice(2) + ')').toLowerCase(), 'Wrong error message')
      }
    },
    {
      name: 'write_string (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_string', [false, 'testWriteStringtestWriteStringtestWriteStringtestWriteStringtestWriteStringtestWriteStringtestWriteString']),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_string (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_string', [true, 'testWriteString']),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_string('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_Array (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_Array', [false, ['a', 'b']]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_Array (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_Array', [true, ['a', 'b']]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_Array('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_Enum (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_Enum', [false, IntegrationTestEnum.VALUE3]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_Enum (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_Enum', [true, IntegrationTestEnum.VALUE3]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_Enum('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_Owner (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_Owner', []),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage === 'Ownable: caller is not the owner', 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_Struct (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_Struct', [false, {value: 10, decimals: 2}]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
      }
    },
    {
      name: 'write_Struct (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_Struct', [true, {value: 10, decimals: 2}]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_Struct('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_address (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_address', [false, address]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
      }
    },
    {
      name: 'write_address (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_address', [true, address]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_address('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_bool (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_bool', [false, true]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_bool (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_bool', [true, true]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bool('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_bytes (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_bytes', [false, Buffer.from('test', 'utf8')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_bytes (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_bytes', [true, Buffer.from('test', 'utf8')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bytes('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_bytes32 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_bytes32', [false, stringToBytes32('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_bytes32 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_bytes32', [true, stringToBytes32('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bytes32('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_bytes4 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_bytes4', [false, stringToBytes4('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_bytes4 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_bytes4', [true, stringToBytes4('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bytes4('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_int256 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_int256', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_int256 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_int256', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int256('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_int64 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_int64', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_int64 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_int64', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int64('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_int32 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_int32', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_int32 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_int32', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int32('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_int8 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_int8', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_int8 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_int8', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int8('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_uint256 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint256', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_uint256 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint256', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint256('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_uint64 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint64', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_uint64 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint64', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint64('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_uint32 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint32', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_uint32 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint32', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint32('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_uint8 (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint8', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_uint8 (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_uint8', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint8('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'write_require (OK)',
      ref: useRef(),
      testFunction: getTestWrite('write_require', [false, 'testRequire']),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.hash, 'Data txhHash should not be null')
      }
    },
    {
      name: 'write_require (KO)',
      ref: useRef(),
      testFunction: getTestWrite('write_require', [true, 'testRequire']),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage === 'testRequire', 'Wrong error message, got : ' + errorMessage)
      }
    }
  ]

  // RENDER Component
  // -----------------------------------------------------------------------------------------------------
  return isMounted && isConnected && address ? (
    <div className='flex flex-col gap-8'>
      <h1 className='text-xl font-medium text-gray-400/80'>{i18n.writeFunctionTests}</h1>
      <Boundary labels={[i18n.testAll]}>
        <div className='flex gap-4'>
          <Button onClick={() => testAll()}>{i18n.testAll}</Button>
        </div>
      </Boundary>
      <Boundary labels={[i18n.unitTests]}>
        <div className='flex flex-col gap-2'>
          {WRITE_TEST_FUNCTIONS.map((writeTestFunction: any, index: number) => {
            return (
              <Test key={index}
                    ref={writeTestFunction.ref}
                    name={writeTestFunction.name}
                    testFunction={writeTestFunction.testFunction}
                    checkFunction={writeTestFunction.checkFunction}/>
            )
          })}
        </div>
      </Boundary>
    </div>
  ) : (
    <Web3Connect/>
  )
}
