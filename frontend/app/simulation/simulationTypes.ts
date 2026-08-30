export interface HitModifiers {
    Torrent : boolean
    LethalHits : boolean
    SustainedHits : number
    RerollOnes : boolean
    RerollFailures : boolean
    Hazardous : boolean
    CriticalHit : number
}

export interface WoundModifiers {
    DevastatingWounds : boolean
    RerollOnes : boolean
    RerollFailures : boolean
    CriticalWound : number
}

export const defaultWoundModifiers =
    {
        DevastatingWounds : false,
        RerollOnes : false,
        RerollFailures : false,
        CriticalWound : 6
    }

export interface SimRequest {
    Attacks: string;
    ToHit: number;
    HitModifiers: HitModifiers;
    ToWound: number;
    WoundModifiers: WoundModifiers;
    ToSave: number;
    Damage: string
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
        Hazardous: false,
        CriticalHit: 6
    }

export const defaultSimRequest : SimRequest =
    {
        Attacks: "10",
        ToHit: 4,
        HitModifiers: defaultHitModifiers,
        ToWound: 4,
        WoundModifiers: defaultWoundModifiers,
        ToSave: 4,
        Damage: "1",
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
    UnsavedWounds: number;
    DamageTotal: number;
    MortalWounds: number;
    ModelsDestroyed: number;
}
