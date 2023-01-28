'use client'

import {useAccount} from 'wagmi'
import {useIsMounted} from '#/web3/useMounted'
import {useI18n} from '#/utils/language'
import {Web3Connect} from '#/web3/web3-connect'
import {Boundary} from '#/ui/Boundary'

import testContractDef from '#/web3/contractsDef/InteractionTest/mumbai/InteractionTest-mumbai.json'
import {bigNumberToNumber, check, encodeString, hexToUtf8, numberToBigNumber, stringToBytes32, stringToBytes4, stringToUint8} from '#/utils/utils';
import {readContract} from '@wagmi/core';
import {getRevertErrorMessage, IntegrationTestEnum} from '#/web3/web3-utils';
import Test from '#/app/web3/read/test';
import Button from '#/ui/Button';
import {useRef} from 'react';
import {BytesCoder} from '@ethersproject/abi/lib/coders/bytes';

const I18N = {
  readFunctionTests: {en: 'Read function Tests', fr: 'Tests des fonctions de lecture'},
  testAll: {en: 'Test all', fr: 'Tester tous'},
  unitTests: {en: 'Atomic tests', fr: 'Tests atomiques'},
}

const getTestRead = (functionName: string, args: any[]) =>
  async (): Promise<{ data: any, errorMessage: any }> => {
    let data, errorMessage
    try {
      data = await readContract({
        address: testContractDef.contractAddress as any,
        abi: testContractDef.contractArtifact.abi,
        functionName: functionName,
        args: args,
      })
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
    for (let i = 0; i < READ_TEST_FUNCTIONS.length; i++) {
      await (READ_TEST_FUNCTIONS[i].ref.current as any).runTest()
    }
  }

  const READ_TEST_FUNCTIONS = [
    {
      name: 'read_AccessControl (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_AccessControl', [encodeString('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage === 'Custom Error: AccessControl_MissingRole(0x0000000000000000000000000000000000000000, ' + encodeString('test').slice(2) + ')', 'Wrong error message')
      }
    },
    {
      name: 'read_string (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_string', [false, 'testReadString']),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data === 'testReadString', 'Data should be equal to ' + 'testReadString')
      }
    },
    {
      name: 'read_string (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_string', [true, 'testReadString']),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_string('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_Array (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_Array', [false, ['a', 'b']]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data.every((d: any) => ['a', 'b'].includes(d)), 'Data should be [\'a\', \'b\']')
      }
    },
    {
      name: 'read_Array (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_Array', [true, ['a', 'b']]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_Array('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_Enum (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_Enum', [false, IntegrationTestEnum.VALUE3]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data === IntegrationTestEnum.VALUE3, 'Data should be ' + IntegrationTestEnum.VALUE3)
      }
    },
    {
      name: 'read_Enum (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_Enum', [true, IntegrationTestEnum.VALUE3]),
      checkFunction: (data: any, errorMessage: any) => {
        console.log('read_Enum (OK)', data, errorMessage)
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_Enum('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_Owner (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_Owner', []),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage === 'Ownable: caller is not the owner', 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_Struct (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_Struct', [false, {value: 10, decimals: 2}]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
      }
    },
    {
      name: 'read_Struct (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_Struct', [true, {value: 10, decimals: 2}]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_Struct('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_address (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_address', [false, address]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
      }
    },
    {
      name: 'read_address (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_address', [true, address]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_address('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_bool (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_bool', [false, true]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(typeof data === 'boolean' && data === true, 'Data should be equal to true')
      }
    },
    {
      name: 'read_bool (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_bool', [true, true]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bool('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_bytes (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_bytes', [false, Buffer.from('test', 'utf8')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(hexToUtf8(data).includes('test'), 'Data should include "test" string')
      }
    },
    {
      name: 'read_bytes (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_bytes', [true, Buffer.from('test', 'utf8')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bytes('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_bytes32 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_bytes32', [false, stringToBytes32('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(hexToUtf8(data).includes('test'), 'Data should include "test" string')
      }
    },
    {
      name: 'read_bytes32 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_bytes32', [true, stringToBytes32('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bytes32('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_bytes4 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_bytes4', [false, stringToBytes4('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(hexToUtf8(data).includes('test'), 'Data should include "test" string')
      }
    },
    {
      name: 'read_bytes4 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_bytes4', [true, stringToBytes4('test')]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_bytes4('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_int256 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_int256', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_int256 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_int256', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int256('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_int64 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_int64', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_int64 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_int64', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int64('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_int32 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_int32', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_int32 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_int32', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int32('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_int8 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_int8', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_int8 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_int8', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_int8('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_uint256 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_uint256', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_uint256 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_uint256', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint256('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_uint64 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_uint64', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_uint64 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_uint64', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint64('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_uint32 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_uint32', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_uint32 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_uint32', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint32('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_uint8 (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_uint8', [false, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(bigNumberToNumber(data) === 12, 'Data should be equal to ' + 12)
      }
    },
    {
      name: 'read_uint8 (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_uint8', [true, 12]),
      checkFunction: (data: any, errorMessage: any) => {
        check(!data, 'Data should be null, instead got: ' + data?.toString())
        check(errorMessage?.includes('Error_uint8('), 'Wrong error message, got : ' + errorMessage)
      }
    },
    {
      name: 'read_require (OK)',
      ref: useRef(),
      testFunction: getTestRead('read_require', [false, 'testRequire']),
      checkFunction: (data: any, errorMessage: any) => {
        check(!errorMessage, 'Error should be null, instead got: ' + errorMessage)
        check(data, 'Data should not be null')
        check(data === 'testRequire', 'Data should be equal to ' + 'testRequire')
      }
    },
    {
      name: 'read_require (KO)',
      ref: useRef(),
      testFunction: getTestRead('read_require', [true, 'testRequire']),
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
      <h1 className='text-xl font-medium text-gray-400/80'>{i18n.readFunctionTests}</h1>
      <Boundary labels={[i18n.testAll]}>
        <div className='flex gap-4'>
          <Button onClick={() => testAll()}>{i18n.testAll}</Button>
        </div>
      </Boundary>
      <Boundary labels={[i18n.unitTests]}>
        <div className='flex flex-col gap-2'>
          {READ_TEST_FUNCTIONS.map((readTestFunction: any, index: number) => {
            return (
              <Test key={index}
                    ref={readTestFunction.ref}
                    name={readTestFunction.name}
                    testFunction={readTestFunction.testFunction}
                    checkFunction={readTestFunction.checkFunction}/>
            )
          })}
        </div>
      </Boundary>
    </div>
  ) : (
    <Web3Connect/>
  )
}
