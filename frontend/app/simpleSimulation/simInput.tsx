import { armorSaveAtom, attacksAtom, criticalHitAtom, criticalWoundAtom, damageAtom, devastatingWoundsEnabled, hitsRerollFailures, hitsRerollOnes, lethalHitsAtom, sustainedHitsAtom, toHitAtom, torrentAtom, toWoundAtom, woundsRerollFailures, woundsRerollOnes } from "./simulationAtoms";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { StringInput } from "../components/StringInput";
import { Checkbox } from "../components/Checkbox";
import { NumericInput } from "../components/NumericInput";

function AttacksInput() {
    const attacksValue = useAtomValue(attacksAtom.currentValueAtom)
    const setAttacks = useSetAtom(attacksAtom.debouncedValueAtom)
    return (
        <div className="border pt-1 pb-1 pl-2 pr-2">
            <div className="flex items-center justify-center">
                <p className="mt-2 text-lg text-gray-200">
                    Attacks
                </p>
            </div>
            <p className="text-sm text-grey-200">Enter a number or a roll, like "2d6 + 6"</p>
            <StringInput label="Attacks" value={attacksValue} onUpdate={(v) => setAttacks(v)} />
        </div>
    )
}

function HitsInput() {
    const toHit = useAtomValue(toHitAtom.currentValueAtom)
    const setToHit = useSetAtom(toHitAtom.debouncedValueAtom)
    const torrent = useAtomValue(torrentAtom.currentValueAtom)
    const setTorrent = useSetAtom(torrentAtom.debouncedValueAtom)
    const lethalHits = useAtomValue(lethalHitsAtom.currentValueAtom)
    const setLethalHits = useSetAtom(lethalHitsAtom.debouncedValueAtom)
    const sustainedHits = useAtomValue(sustainedHitsAtom.currentValueAtom)
    const setSustainedHits = useSetAtom(sustainedHitsAtom.debouncedValueAtom)
    const criticalHit = useAtomValue(criticalHitAtom.currentValueAtom)
    const setCriticalHit = useSetAtom(criticalHitAtom.debouncedValueAtom)

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
            <NumericInput label="Critical Hit" value={criticalHit} onUpdate={(v) => setCriticalHit(v)} disabled={torrent} minValue={2} maxValue={6} />
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
    const armorSaveValue = useAtomValue(armorSaveAtom.currentValueAtom)
    const setArmorSave = useSetAtom(armorSaveAtom.debouncedValueAtom)

    const rerollOnes = useAtomValue(woundsRerollOnes.currentValueAtom)
    const setRerollOnes = useSetAtom(woundsRerollOnes.debouncedValueAtom)
    const rerollFailures = useAtomValue(woundsRerollFailures.currentValueAtom)
    const setRerollFailures = useSetAtom(woundsRerollFailures.debouncedValueAtom)

    return (
        <div className="border pt-1 pb-1 pl-2 pr-2">
            <div className="flex items-center justify-center">
                <p className="mt-2 text-lg text-gray-200">
                    Wounds
                </p>
            </div>
            <NumericInput label="To Wound" value={toWound} onUpdate={(v) => setToWound(v)} minValue={2} maxValue={6} />
            <Checkbox label="Devastating Wounds" value={devWoundsEnabled} onUpdate={(b) => enableDevWounds(b)} />
            <NumericInput label="Critical Wound" value={criticalWound} onUpdate={(v) => setCriticalWound(v)} minValue={toWound} maxValue={6} disabled={!devWoundsEnabled} />
            <Checkbox label="Reroll Ones" disabled={rerollFailures} value={rerollOnes} onUpdate={(b) => setRerollOnes(b)} />
            <Checkbox label="Reroll Failures" disabled={rerollOnes} value={rerollFailures} onUpdate={(b) => setRerollFailures(b)} />
            <NumericInput label="Armor Save" value={armorSaveValue} onUpdate={(v) => setArmorSave(v)} />
        </div>
    )
}

function DamageInput() {
    const damageInput = useAtomValue(damageAtom.currentValueAtom)
    const setDamageInput = useSetAtom(damageAtom.debouncedValueAtom)

    return (
        <div className="border pt-1 pb-1 pl-2 pr-2">
            <div className="flex items-center justify-center">
                <p className="mt-2 text-lg text-gray-200">
                    Damage
                </p>
            </div>
            <p className="text-sm text-grey-200">Enter a number or a roll, like "2d3 + 4"</p>
            <StringInput label="Attacks" value={damageInput} onUpdate={(v) => setDamageInput(v)} />
        </div>
    )
}

export function SimInput() {
    return (
        <div className="flex">
            <div>
                <AttacksInput />
                <HitsInput />
            </div>
            <div>
                <WoundsInput />
                <DamageInput />
            </div>
        </div>
    )
}

