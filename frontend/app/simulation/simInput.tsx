import { attacksAtom, toHitAtom, torrentAtom, toWoundAtom } from "./simulationAtoms";
import { useAtomValue } from "jotai";
import { useSetAtom } from "jotai";
import { StringInput } from "../components/StringInput";
import { Checkbox } from "../components/Checkbox";
import { NumericInput } from "../components/NumericInput";

export function SimInput() {
    const attacksValue = useAtomValue(attacksAtom.currentValueAtom)
    const setAttacks = useSetAtom(attacksAtom.debouncedValueAtom)
    const toHit = useAtomValue(toHitAtom.currentValueAtom)
    const setToHit = useSetAtom(toHitAtom.debouncedValueAtom)
    const torrent = useAtomValue(torrentAtom.currentValueAtom)
    const setTorrent = useSetAtom(torrentAtom.debouncedValueAtom)
    const toWound = useAtomValue(toWoundAtom.currentValueAtom)
    const setToWound = useSetAtom(toWoundAtom.debouncedValueAtom)

    return (
        <div>
            <StringInput label="Attacks" value={attacksValue} onUpdate={(v) => setAttacks(v)} />
            <Checkbox label="Torrent" value={torrent} onUpdate={(b) => setTorrent(b)} />
            <NumericInput label="To Hit" value={toHit} onUpdate={(v) => setToHit(v)} disabled={torrent} minValue={2} maxValue={6} />
            <NumericInput label="To Wound" value={toWound} onUpdate={(v) => setToWound(v)} minValue={2} maxValue={6}  />
        </div>
    )
}

