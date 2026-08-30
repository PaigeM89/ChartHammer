namespace ChartHammer.API


module DTOs =

    [<CLIMutable>]
    type WoundModifiers = 
        {
            DevastatingWounds : bool
        }

    [<CLIMutable>]
    type SimulationInputDto =
        {
            Attacks: string
            ToHit: int
            HitModifiers : (string * int) list
            ToWound: int
            CriticalWound : int
            //WoundModifiers : string list
            WoundModifiers : WoundModifiers
            ToSave: int
            DamagePerHit: int
            DamageModifiers : string list
            EnemyModelHitPoints : int
        }

    type HitsResultDto =
        {
            NaturalHits : float
            SustainedHits : float
            AutoWounds : float
            NaturalOnes : float
        }

    type WoundsResultDto =
        {
            RegularWounds : float
            DevastatingWounds : float
        }

    type SimResultDto =
        {
            AttackCount : float
            Hits : HitsResultDto
            Wounds : WoundsResultDto
            UnsavedWounds : float
            DamageTotal : float
            MortalWounds : float
            ModelsDestroyed : float
        }
