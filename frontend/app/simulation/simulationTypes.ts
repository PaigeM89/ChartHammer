export interface HitModifiers {
    Torrent : boolean
    LethalHits : boolean
    SustainedHits : number
    RerollOnes : boolean
    RerollFailures : boolean
    Hazardous : boolean
}

export interface WoundModifiers {
    DevastatingWounds : boolean
}

export interface SimRequest {
    Attacks: string;
    ToHit: number;
    HitModifiers: HitModifiers;
    ToWound: number;
    CriticalWound: number;
    WoundModifiers: WoundModifiers;
    ToSave: number;
    DamagePerHit: number;
    DamageModifiers: string[];
    EnemyModelHitPoints: number;
}

export const defaultHitModifiers : HitModifiers =
    {
        Torrent: false,
        LethalHits: false,
        SustainedHits: 0,
        RerollOnes: false,
        RerollFailures: false,
        Hazardous: false
    }

export const defaultSimRequest : SimRequest =
    {
        Attacks: "10",
        ToHit: 4,
        HitModifiers: defaultHitModifiers,
        ToWound: 4,
        CriticalWound: 6,
        WoundModifiers: { DevastatingWounds: false },
        ToSave: 4,
        DamagePerHit: 1,
        DamageModifiers: [],
        EnemyModelHitPoints: 1
    };

export interface HitsResult {
    NaturalHits: number;
    SustainedHits: number;
    AutoWounds: number;
    NaturalOnes: number;
}

export interface WoundsResult {
    RegularWounds: number;
    DevastatingWounds: number;
}

export interface SimResult {
    AttackCount: number;
    Hits: HitsResult;
    Wounds: WoundsResult;
    UnsavedWounds: number,
    DamageTotal: number;
    MortalWounds: number;
    ModelsDestroyed: number;
}
