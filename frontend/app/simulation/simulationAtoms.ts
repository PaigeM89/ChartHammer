import { atom, type SetStateAction } from 'jotai'
import { defaultSimRequest } from './simulationTypes'

// Copied from Jotai's website
function atomWithDebounce<T>(
  initialValue: T,
  delayMilliseconds = 500,
  shouldDebounceOnReset = false,
) {
  const prevTimeoutAtom = atom<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )

  // DO NOT EXPORT currentValueAtom as using this atom to set state can cause
  // inconsistent state between currentValueAtom and debouncedValueAtom
  const _currentValueAtom = atom(initialValue)
  const isDebouncingAtom = atom(false)

  const debouncedValueAtom = atom(
    initialValue,
    (get, set, update: SetStateAction<T>) => {
      clearTimeout(get(prevTimeoutAtom))

      const prevValue = get(_currentValueAtom)
      const nextValue =
        typeof update === 'function'
          ? (update as (prev: T) => T)(prevValue)
          : update

      const onDebounceStart = () => {
        set(_currentValueAtom, nextValue)
        set(isDebouncingAtom, true)
      }

      const onDebounceEnd = () => {
        set(debouncedValueAtom, nextValue)
        set(isDebouncingAtom, false)
      }

      onDebounceStart()

      if (!shouldDebounceOnReset && nextValue === initialValue) {
        onDebounceEnd()
        return
      }

      const nextTimeoutId = setTimeout(() => {
        onDebounceEnd()
      }, delayMilliseconds)

      // set previous timeout atom in case it needs to get cleared
      set(prevTimeoutAtom, nextTimeoutId)
    },
  )

  // exported atom setter to clear timeout if needed
  const clearTimeoutAtom = atom(null, (get, set, _arg) => {
    clearTimeout(get(prevTimeoutAtom))
    set(isDebouncingAtom, false)
  })

  return {
    currentValueAtom: atom((get) => get(_currentValueAtom)),
    isDebouncingAtom,
    clearTimeoutAtom,
    debouncedValueAtom,
  }
}

export const attacksAtom = atomWithDebounce("10")
export const torrentAtom = atomWithDebounce(false)
export const toHitAtom = atomWithDebounce(4)
export const toWoundAtom = atomWithDebounce(4)


export const simRequestAtom = atom((get) => {
    const toHit = get(toHitAtom.debouncedValueAtom)
    let request = { 
      ...defaultSimRequest,
      Attacks: get(attacksAtom.debouncedValueAtom), 
      ToHit: toHit,
      ToWound: get(toWoundAtom.debouncedValueAtom),
    }

    if(get(torrentAtom.debouncedValueAtom))
        request = { ...request, HitModifiers: [ ["Torrent", 0] ]}
    
    return request;
})
