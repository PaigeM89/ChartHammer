namespace ChartHammer

open ChartHammer.Types

module Damage =
    
    let simulateDamage input simResult =
        if simResult.UnsavedWoundCount <= 0
        then simResult
        else
            let damageTotal = input.DamagePerHit * simResult.UnsavedWoundCount
            let modelsDestroyed = 
                float damageTotal / float input.EnemyModelHitPoints
            { simResult with
                DamageTotal = damageTotal
                ModelsDestroyed = int modelsDestroyed
            }
