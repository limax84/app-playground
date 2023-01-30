import {useState} from 'react';
import {formatDt} from '#/utils/utils';

/**
 * TODO Comment
 */
export interface Block {
  number: number,
  timestamp: number
}

/**
 * TODO Comment
 * @param props
 * @constructor
 */
export const BlockItem = (props: { block: Block }) => {

  const [showDetails, setShowDetails] = useState<boolean>(false)

  return (
    <div className={'flex flex-col gap-2 w-full text-xs font-light'}>
      <div className={'flex items-center gap-2 w-full cursor-pointer opacity-95 hover:opacity-100'} onClick={() => setShowDetails(!showDetails)}>
        <div className={'transition-all ' + (showDetails ? 'rotate-90' : 'rotate-270')}>➧</div>
        <div className={''}>{formatDt(props.block.timestamp)}</div>
        <div className={''}>#{props.block.number}</div>
      </div>
      <div className={'flex-col mb-2 ' + (showDetails ? ('flex') : ('hidden'))}>
        <textarea rows={10}
                  wrap=""
                  className={'noScrollBar w-full font-semibold text-xs rounded-md bg-white/5 border-white/20 overflow-auto whitespace-pre'}
                  value={JSON.stringify(props.block, null, 2)}
                  readOnly={true}></textarea>
      </div>
    </div>
  )
}
