namespace ChartHammer.API


module DTOs =

    [<CLIMutable>]
    type SimulationInputDto =
        {
            Attacks: string
            ToHit: int
            HitModifiers : (string * int) list
            ToWound: int
            WoundModifiers : string list
            ToSave: int
            DamagePerHit: int
            DamageModifiers : string list
            EnemyModelHitPoints : int
        }

