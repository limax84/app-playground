import React, {useEffect, useState} from 'react'


// Types definition
export type LangCode = 'en' | 'fr'
export type I18n = { [key: string]: any }

// Languages definitions
const languages: I18n = {
  'en': 'English',
  'fr': 'Français'
}

// CONSTANTS
const LOCAL_STORAGE_LANG_KEY: string = 'lang'
const DEFAULT_LANG_CODE: LangCode = 'en'


export const langInitialState = DEFAULT_LANG_CODE
export const LangReducer = (state: string, action: { type: string, value: string }) => {
  switch (action.type) {
    case 'change': {
      return action.value
    }
  }
};


// CONTEXT Definition
// ---------------------------------------------------------------------------------------------------------------------

const LangContext = React.createContext<[LangCode | null, React.Dispatch<React.SetStateAction<LangCode | null>>] | undefined>(undefined)

export function LangProvider({children}: { children: React.ReactNode }) {

  const [lang, setLang] = React.useState<LangCode | null>(null)

  // Check if a Language is already STORED or exists in ROUTE
  useEffect(() => {
    setLang((localStorage.getItem(LOCAL_STORAGE_LANG_KEY) || DEFAULT_LANG_CODE) as LangCode)
  }, [])

  // Set the lang in local storage if different and not null
  useEffect(() => {
    if (lang && lang !== localStorage.getItem(LOCAL_STORAGE_LANG_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang || DEFAULT_LANG_CODE)
    }
  }, [lang])

  return (
    <LangContext.Provider value={[lang, setLang]}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const context = React.useContext(LangContext)
  if (context === undefined) throw new Error('useLang must be used within a LangProvider')
  return context
}

export function useI18n(input: any) {
  const [lang] = useLang()
  return _getI18n(input, lang || DEFAULT_LANG_CODE)
}

// Recursive function getting the I18n object for the given lang
const _getI18n = (input: any, lang: LangCode): any => {
  if (Array.isArray(input))
    return input.map(elt => _getI18n(elt, lang))
  if (typeof input === 'object') {
    if (typeof input[lang] != 'undefined')
      return _getI18n(input[lang], lang)
    const res: { [key: string]: any } = {}
    for (const [key, value] of Object.entries(input))
      res[key] = _getI18n(value, lang)
    return res
  }
  return input
}

/**
 * COMPONENT Definition
 * ---------------------------------------------------------------------------------------------------------------------
 */
export default function Language() {

  // GLOBAL states
  const [lang, setLang] = useLang()

  // LOCAL states
  const [show, setShow] = useState(false)

  // Set the lang in context, close languages menu // TODO save in route
  const changeLang = (_lang: LangCode) => {
    setLang(_lang)
    setShow(false)
  }

  // Rendering
  // -------------------------------------------------------------------------------------------------------------------
  return (
    <div className={'flex flex-col items-center'}>
      <div
        onClick={() => setShow(!show)}
        className={'relative flex justify-center items-center cursor-default text-2xl select-none'}
      >
        <a className={'relative p-4 px-2 ' +
          'after:transition-all after:w-full after:scale-[0.0] hover:after:scale-[1.0] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-main'}>
          {languages[lang || DEFAULT_LANG_CODE]}
        </a>
        <div className={'absolute right-[-2.5rem] mt-[-0.4rem] h-8 w-8'}>
          <div className={'absolute top-[50%] bg-main/80 h-1 w-[50%] transition-all ' +
            (show ? 'rotate-[125deg]' : 'rotate-[55deg]')}/>
          <div className={'absolute top-[50%] bg-main/80 h-1 w-[50%] transition-all translate-x-[45%] ' +
            (show ? 'rotate-[-125deg]' : 'rotate-[-55deg]')}/>
        </div>
      </div>
      <ul className={'flex flex-col items-center text-lg transition-all origin-top ' +
        (show ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0')}>
        {Object.keys(languages).map((languageCode: string) =>
          languageCode !== lang &&
          (<li key={languageCode} className={'mt-2 cursor-pointer hover:underline'}
               onClick={() => changeLang(languageCode as LangCode)}>
            {languages[languageCode as LangCode]}
          </li>)
        )}
      </ul>
    </div>
  )
}
