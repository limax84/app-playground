import {ForwardedRef, forwardRef, useImperativeHandle, useState} from 'react'
import Button from '#/ui/Button'
import {LoadingIcon} from '#/ui/LoadingIcon';
import {CheckIcon} from '#/ui/CheckIcon';

/**
 * Test COMPONENT
 */
export const Test = forwardRef((props: {
  name: string
  testFunction: () => Promise<{ data: any, errorMessage: any }>
  checkFunction?: (data: any, errorMessage: string) => void
}, ref: ForwardedRef<any>) => {

  const [running, setRunning] = useState<true | false>(false)
  const [success, setSuccess] = useState<true | false | undefined>(undefined)

  const run = async () => {
    setRunning(true)
    const {data, errorMessage} = await props.testFunction()
    try {
      if (props.checkFunction) props.checkFunction(data, errorMessage)
      else if (errorMessage) throw errorMessage
      console.log('Test [' + props.name + '] succeeded!')
      setSuccess(true)
    } catch (e) {
      console.warn('Test [' + props.name + '] failed!', e)
      setSuccess(false)
    }
    setRunning(false)
  }

  // Allow parent to call this child component method
  useImperativeHandle(ref, () => ({
    runTest() {
      return run()
    }
  }))

  // Render
  return (
    <div className={'flex flex-row items-center gap-4 h-6'}>
      <Button disabled={running} onClick={run}>Test</Button>
      <div id="LABEL">{props.name}</div>
      <div id="RES">{
        running ? (<LoadingIcon w={24} h={24}/>) :
          typeof success !== 'boolean' ? (<></>) :
            success ? (<CheckIcon w={24} h={24}/>) : (<div className={'text-[red]'}>X</div>)
      }</div>
    </div>
  )
})

Test.displayName = 'Test';
export default Test
