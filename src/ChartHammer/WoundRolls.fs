namespace ChartHammer

module WoundRolls =
    open ChartHammer.Types
    open Generator

    // let private runRerolls input rolls =
    //     if input.WoundModifiers.RerollFailures
    //     then
    //         let hits, misses = List.partition (fun r -> r >= input.ToWound) rolls
    //         let rerolls = generate (List.length misses) |> List.ofSeq
    //         hits @ rerolls
    //     else if input.WoundModifiers.RerollOnes
    //     then 
    //         let nonOnes, ones = List.partition (fun r -> r > 1) rolls
    //         let rerolls = generate (List.length ones) |> List.ofSeq
    //         nonOnes @ rerolls
    //     else rolls

    let simulateWoundRolls input simResult =
        if simResult.Hits.TotalHits <= 0 then simResult
        else
            let hitsToRoll = SimResult.getRollableHitCount simResult
            let rolls = 
                generate hitsToRoll |> Seq.toList
                |> Helpers.applyRerolls input.ToWound input.WoundModifiers.RerollFailures input.WoundModifiers.RerollOnes
            let successfulWounds, _ = rolls.NewRolls |> List.partition (fun r -> r >= input.ToWound)
            if input.WoundModifiers.Devastating
            then
                let criticalWounds, regularWounds = successfulWounds |> List.partition (fun r -> r >= input.WoundModifiers.CriticalWound)
                let woundsResult =
                    { WoundsResult.Empty() with
                        RegularWounds = regularWounds |> List.length
                        AutoDamage = criticalWounds |> List.length
                        Rerolls = rolls.RerollCount
                    }
                { simResult with Wounds = woundsResult }
            else
                let woundsResult =
                    { WoundsResult.Empty() with
                        RegularWounds = successfulWounds |> List.length
                        AutoDamage = 0
                        Rerolls = rolls.RerollCount
                    }
                { simResult with Wounds = woundsResult }
