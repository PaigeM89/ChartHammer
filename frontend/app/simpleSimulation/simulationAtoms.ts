import { atom, type SetStateAction } from 'jotai'
import { defaultHitModifiers, defaultSimRequest } from './simulationTypes'

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
export const lethalHitsAtom = atomWithDebounce(false)
export const sustainedHitsAtom = atomWithDebounce(0)
export const hitsRerollOnes = atomWithDebounce(false)
export const hitsRerollFailures = atomWithDebounce(false)
export const hazardous = atomWithDebounce(false)
export const criticalHitAtom = atomWithDebounce(6)
export const toWoundAtom = atomWithDebounce(4)
export const woundsRerollOnes = atomWithDebounce(false)
export const woundsRerollFailures = atomWithDebounce(false)
export const devastatingWoundsEnabled = atomWithDebounce(false)
export const precisionHitsEnabled = atomWithDebounce(false)
export const criticalWoundAtom = atomWithDebounce(6)

export const damageAtom = atomWithDebounce("1")

export const hitsModifierAtom = atom((get) => {
  let hitModifiers = 
    {
      ...defaultHitModifiers,
      Torrent: get(torrentAtom.debouncedValueAtom),
      LethalHits: get(lethalHitsAtom.debouncedValueAtom),
      SustainedHits: get(sustainedHitsAtom.debouncedValueAtom),
      RerollOnes: get(hitsRerollOnes.debouncedValueAtom),
      RerollFailures: get(hitsRerollFailures.debouncedValueAtom),
      Hazardous: get(hazardous.debouncedValueAtom),
      CriticalHit: get(criticalHitAtom.debouncedValueAtom)
    }
  return hitModifiers;
})

export const woundModifiersAtom = atom((get) => {
  return (
    {
      DevastatingWounds: get(devastatingWoundsEnabled.debouncedValueAtom),
      RerollOnes: get(woundsRerollOnes.debouncedValueAtom),
      RerollFailures: get(woundsRerollFailures.debouncedValueAtom),
      CriticalWound: get(criticalWoundAtom.debouncedValueAtom)
    }
  )
})

export const simRequestAtom = atom((get) => {
    let criticalWound = get(criticalWoundAtom.debouncedValueAtom);
    if (!get(devastatingWoundsEnabled.debouncedValueAtom))
    {
      criticalWound = 7;
    }
    let request = { 
      ...defaultSimRequest,
      Attacks: get(attacksAtom.debouncedValueAtom), 
      ToHit: get(toHitAtom.debouncedValueAtom),
      HitModifiers: get(hitsModifierAtom),
      ToWound: get(toWoundAtom.debouncedValueAtom),
      WoundModifiers: get(woundModifiersAtom),
      Damage: get(damageAtom.debouncedValueAtom)
    }

    return request;
})

export const isAnyDebouncing = atom((get) => {
  const isDebouncing =
    get(attacksAtom.isDebouncingAtom)
    ||
    get(torrentAtom.isDebouncingAtom)
    ||
    get(toHitAtom.isDebouncingAtom)
    ||
    get(lethalHitsAtom.isDebouncingAtom)
    ||
    get(toWoundAtom.isDebouncingAtom)
    ||
    get(criticalWoundAtom.isDebouncingAtom)
    ;
  return isDebouncing;
})