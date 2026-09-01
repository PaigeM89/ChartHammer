namespace ChartHammer

open ChartHammer.Types

module Damage =
    
    let private getSingleDamageRoll input  =
        match input.Damage with
        | StaticValue d -> d
        | DiceRoll (count, sides, modifier) ->
            let rollTotal = Generator.rollCustomDice count sides |> Seq.sum
            rollTotal + modifier

    let private setTotalDamage input simResult =
        let damageRolls = 
            seq {
                for i in 0..(simResult.UnsavedWoundCount - 1) do getSingleDamageRoll input
            }
        let damageTotal = Seq.sum damageRolls
        { simResult with DamageTotal = damageTotal }


    let private setMortalWounds input simResult =
        if simResult.Wounds.AutoDamage <= 0
        then simResult
        else
            let damageRolls = 
                seq {
                    for i in 0..(simResult.Wounds.AutoDamage - 1) do getSingleDamageRoll input
                }
            let mortals = Seq.sum damageRolls
            { simResult with MortalWounds = mortals }

    let simulateDamage input simResult =
        if simResult.UnsavedWoundCount <= 0
        then simResult
        else
            setTotalDamage input simResult
            |> setMortalWounds input
