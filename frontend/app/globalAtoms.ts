import { atom } from "jotai";

export enum CurrentTab {
    Simple,
    Layered
}

export const currentTabAtom = atom(CurrentTab.Simple)
