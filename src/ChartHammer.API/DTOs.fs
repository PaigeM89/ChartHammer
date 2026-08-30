namespace ChartHammer.API


module DTOs =

    [<CLIMutable>]
    type HitModifiersDto = {
        Torrent : bool
        LethalHits : bool
        SustainedHits : int
        RerollOnes : bool
        RerollFailures : bool
        Hazardous : bool
        CriticalHit : int
    }

    [<CLIMutable>]
    type WoundModifiers = 
        {
            DevastatingWounds : bool
            RerollOnes : bool
            RerollFailures : bool
            CriticalWound : int
        }

    [<CLIMutable>]
    type SimulationInputDto =
        {
            Attacks: string
            ToHit: int
            HitModifiers : HitModifiersDto
            ToWound: int            
            WoundModifiers : WoundModifiers
            ToSave: int
            Damage: string
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
