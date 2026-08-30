export interface SimRequest {
    Attacks: string;
    ToHit: number;
    HitModifiers: [string, number][];
    ToWound: number;
    CriticalWound: number;
    WoundModifiers: string[];
    ToSave: number;
    DamagePerHit: number;
    DamageModifiers: string[];
    EnemyModelHitPoints: number;
}

export const defaultSimRequest : SimRequest =
    {
        Attacks: "10",
        ToHit: 4,
        HitModifiers: [],
        ToWound: 4,
        CriticalWound: 6,
        WoundModifiers: [],
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
