namespace ChartHammer.API

open System

module DTOs =

    type SimulationInputDto = {
        Attacks : string
        ToHit : int
        HitModifiers : string list
        ToWound : int
        WoundModifiers : string list
        ToSave : int
        DamagerPerHit : int
        DamageModifiers : string list
        EnemyModelHitPoints : int
    }

    

