'use client'

import React from 'react'
import {usePathname} from 'next/navigation'
import Link from 'next/link';

export function AddressBar() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-x-2 p-3.5 lg:px-5 lg:py-3">
      <div className="text-gray-600">
        <Link href={'/'}>
          <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#bbbbbb" version="1.1" id="Capa_1" width="16px" height="16px" viewBox="0 0 495.398 495.398" xmlSpace="preserve">
            <g>
              <g>
                <g>
                  <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391     v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158     c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747     c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z"/>
                  <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401     c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79     c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z"/>
                </g>
              </g>
            </g>
          </svg>
        </Link>
      </div>
      <div className="flex gap-x-1 text-sm font-medium">
        <div>
          <span className="px-2 text-gray-400">
            <Link href={'/'}>Home</Link>
          </span>
        </div>
        {pathname ? (
          <>
            <span className="text-gray-600">/</span>
            {pathname
              .split('/')
              .slice(1)
              .map((segment: string, index: number) => {
                const segmentPath = pathname.split('/').slice(0, 2 + index).join('/')
                return segment?.length > 0 ? (
                  <React.Fragment key={segment + '-' + index}>
                    <span>
                      <span
                        key={segment + '-' + index}
                        className="animate-[highlight_1s_ease-in-out_1] rounded-full px-1.5 py-0.5 text-gray-100"
                      >
                      <Link href={segmentPath}>{segment}</Link>
                      </span>
                    </span>

                    <span className="text-gray-600">/</span>
                  </React.Fragment>
                ) : (<div key={segment + '-' + index}></div>)
              })}
          </>
        ) : null}
      </div>
    </div>
  )
}
