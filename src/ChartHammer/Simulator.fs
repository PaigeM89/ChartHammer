namespace ChartHammer

module Simulation = 
    open ChartHammer
    open ChartHammer.SharedTypes.Types
    
    let private simulateAttackCount input simResult =
        let attacks = 
            match input.Attacks with
            | StaticValue x -> x
            | DiceRoll (sides, count, modifier) ->
                let rollValues = Generator.rollCustomDice count sides |> Seq.sum
                rollValues + modifier
        { simResult with AttackCount = attacks }

    let simulateFullAttack input =
        SimulationResult.Empty()
        |> simulateAttackCount input
        |> HitRolls.simulateHitRolls input
        |> WoundRolls.simulateWoundRolls input
        |> SaveRolls.simulateSaveRolls input

