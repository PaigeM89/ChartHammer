namespace ChartHammer

open ChartHammer.Types

module Damage =
    
    let simulateDamage input simResult =
        if simResult.UnsavedWoundCount <= 0
        then simResult
        else
            match input.Damage with
            | StaticValue d ->
                let damageTotal = d * simResult.UnsavedWoundCount
                let modelsDestroyed = 
                    float damageTotal / float input.EnemyModelHitPoints
                { simResult with
                    DamageTotal = damageTotal
                    ModelsDestroyed = int modelsDestroyed
                }
            | _ -> simResult
