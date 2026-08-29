export interface ChartRequest {
    Attacks: string;
    ToHit: number;
    HitModifiers: [string, number][];
    ToWound: number;
    WoundModifiers: string[];
    ToSave: number;
    DamagePerHit: number;
    DamageModifiers: string[];
    EnemyModelHitPoints: number;
}

export const testData : ChartRequest =
    {
        Attacks: "20",
        ToHit: 3,
        HitModifiers: [
            [
                "SustainedHits",
                1
            ],
            [
                "RerollOnes",
                0
            ]
        ],
        ToWound: 3,
        WoundModifiers: [],
        ToSave: 5,
        DamagePerHit: 3,
        DamageModifiers: [],
        EnemyModelHitPoints: 12
    };

export interface HitsResponse {
    NaturalHits: number;
    SustainedHits: number;
    AutoWounds: number;
    HitNaturalOnes: number;
}

export interface ChartResponse {
    AttackCount: number;
    Hits: HitsResponse;
    DevastatingWounds: number;
    RegularWounds: number;
    UnsavedWoundCount: number,
    DamageTotal: number;
    MortalWounds: number;
    ModelsDestroyed: number;
}
