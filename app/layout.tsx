'use client'

import '#/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import {AddressBar} from '#/ui/AddressBar';
import {GlobalNav} from '#/ui/GlobalNav';
import {ToastContainer} from 'react-toastify';
import {LangProvider} from '#/utils/language';
import Head from '#/app/head';
import {JarvixLogo} from '#/ui/JarvixLogo';
import {Web3Provider} from '#/web3/web3-context';

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" className="[color-scheme:dark]">
    <Head/>
    <body className="overflow-y-scroll bg-gray-1100 bg-[url('/grid.svg')]">

    <LangProvider>
      <Web3Provider>

        <GlobalNav/>

        <div className="lg:pl-72">
          <div className="mx-auto max-w-4xl px-2 pt-20 space-y-8 lg:px-8 lg:py-8">
            <div className="rounded-lg p-px shadow-lg shadow-black/20 bg-vc-border-gradient">
              <div className="rounded-lg bg-black">
                <AddressBar/>
              </div>
            </div>
            <div className="rounded-lg p-px shadow-lg shadow-black/20 bg-vc-border-gradient">
              <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
            </div>

            <div className="rounded-lg p-px shadow-lg shadow-black/20 bg-vc-border-gradient">
              <div className="rounded-lg bg-black">
                <Byline/>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer
          position="bottom-center"
          theme="dark"
          autoClose={3000}
          limit={6}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName={'custom-toast'}
          bodyClassName={'custom-toast-body'}
        />

      </Web3Provider>
    </LangProvider>

    </body>
    </html>
  );
}

function Byline() {
  return (
    <div className="flex items-center justify-between gap-x-4 p-3.5 lg:px-5 lg:py-3">
      <div className="flex items-center gap-x-1.5">
        <a href="https://jarvix.com" title="jarvix.com">
          <div className="w-16 text-gray-100 hover:text-gray-50">
            <JarvixLogo className={'grayscale'}/>
          </div>
        </a>
      </div>

      <div className="text-sm text-gray-400">
        <a
          className="underline decoration-dotted underline-offset-4 hover:text-gray-400"
          href="https://github.com/vercel/app-playground"
          target="_blank"
          rel="noreferrer"
        >
          View code
        </a>
      </div>
    </div>
  );
}
