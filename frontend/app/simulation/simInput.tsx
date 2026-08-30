import { attacksAtom, criticalWoundAtom, devastatingWoundsEnabled, hitsRerollFailures, hitsRerollOnes, lethalHitsAtom, sustainedHitsAtom, toHitAtom, torrentAtom, toWoundAtom } from "./simulationAtoms";
import { useAtom, useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { StringInput } from "../components/StringInput";
import { Checkbox } from "../components/Checkbox";
import { NumericInput } from "../components/NumericInput";

function HitsInput() {
    const toHit = useAtomValue(toHitAtom.currentValueAtom)
    const setToHit = useSetAtom(toHitAtom.debouncedValueAtom)
    const torrent = useAtomValue(torrentAtom.currentValueAtom)
    const setTorrent = useSetAtom(torrentAtom.debouncedValueAtom)
    const lethalHits = useAtomValue(lethalHitsAtom.currentValueAtom)
    const setLethalHits = useSetAtom(lethalHitsAtom.debouncedValueAtom)
    const sustainedHits = useAtomValue(sustainedHitsAtom.currentValueAtom)
    const setSustainedHits = useSetAtom(sustainedHitsAtom.debouncedValueAtom)

    const rerollOnes = useAtomValue(hitsRerollOnes.currentValueAtom)
    const setRerollOnes = useSetAtom(hitsRerollOnes.debouncedValueAtom)
    const rerollFailures = useAtomValue(hitsRerollFailures.currentValueAtom)
    const setRerollFailures = useSetAtom(hitsRerollFailures.debouncedValueAtom)

    return (
        <div className="border pt-1 pb-1 pl-2 pr-2">
            <div className="flex items-center justify-center">
                <p className="mt-2 text-lg text-gray-200">
                    Hits
                </p>
            </div>
            <Checkbox label="Torrent" value={torrent} onUpdate={(b) => setTorrent(b)} />
            <NumericInput label="To Hit" value={toHit} onUpdate={(v) => setToHit(v)} disabled={torrent} minValue={2} maxValue={6} />
            <Checkbox label="Lethal Hits" value={lethalHits} onUpdate={(b) => setLethalHits(b)} />
            <NumericInput label="Sustained Hits" value={sustainedHits} onUpdate={(v) => setSustainedHits(v)} disabled={torrent} minValue={0} maxValue={10} />
            <Checkbox label="Reroll Ones" disabled={rerollFailures} value={rerollOnes} onUpdate={(b) => setRerollOnes(b)} />
            <Checkbox label="Reroll Failures" disabled={rerollOnes} value={rerollFailures} onUpdate={(b) => setRerollFailures(b)} />
        </div>
    )
}

function WoundsInput() {
    const devWoundsEnabled = useAtomValue(devastatingWoundsEnabled.currentValueAtom)
    const enableDevWounds = useSetAtom(devastatingWoundsEnabled.debouncedValueAtom)
    const toWound = useAtomValue(toWoundAtom.currentValueAtom)
    const setToWound = useSetAtom(toWoundAtom.debouncedValueAtom)
    const criticalWound = useAtomValue(criticalWoundAtom.currentValueAtom)
    const setCriticalWound = useSetAtom(criticalWoundAtom.debouncedValueAtom)

    return (
        <div>
            <NumericInput label="To Wound" value={toWound} onUpdate={(v) => setToWound(v)} minValue={2} maxValue={6} />
            <Checkbox label="Devastating Wounds" value={devWoundsEnabled} onUpdate={(b) => enableDevWounds(b)} />
            <NumericInput label="Critical Wound" value={criticalWound} onUpdate={(v) => setCriticalWound(v)} minValue={toWound} maxValue={6} disabled={!devWoundsEnabled} />
        </div>
    )
}

export function SimInput() {
    const attacksValue = useAtomValue(attacksAtom.currentValueAtom)
    const setAttacks = useSetAtom(attacksAtom.debouncedValueAtom)
    // const toHit = useAtomValue(toHitAtom.currentValueAtom)
    // const setToHit = useSetAtom(toHitAtom.debouncedValueAtom)
    // const torrent = useAtomValue(torrentAtom.currentValueAtom)
    // const setTorrent = useSetAtom(torrentAtom.debouncedValueAtom)
    // const lethalHits = useAtomValue(lethalHitsAtom.currentValueAtom)
    // const setLethalHits = useSetAtom(lethalHitsAtom.debouncedValueAtom)

    return (
        <div>
            <StringInput label="Attacks" value={attacksValue} onUpdate={(v) => setAttacks(v)} />
            <HitsInput />
            {/* <Checkbox label="Torrent" value={torrent} onUpdate={(b) => setTorrent(b)} />
            <NumericInput label="To Hit" value={toHit} onUpdate={(v) => setToHit(v)} disabled={torrent} minValue={2} maxValue={6} />
            <Checkbox label="Lethal Hits" value={lethalHits} onUpdate={(b) => setLethalHits(b)} /> */}
            <WoundsInput />
        </div>
    )
}

