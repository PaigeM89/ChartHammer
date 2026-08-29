import { atom } from 'jotai'
import { defaultSimRequest } from './simulationTypes'

export const toHitAtom = atom(4)

export const simRequestAtom = atom((get) => {
    const toHit = get(toHitAtom)

    return { ...defaultSimRequest, ToHit: toHit };
})
