namespace ChartHammer

module WoundRolls =
    open ChartHammer.Types
    open Generator

    let private runRerolls input rolls =
        if input.WoundModifiers.RerollFailures
        then
            let hits, misses = List.partition (fun r -> r >= input.ToWound) rolls
            let rerolls = generate (List.length misses) |> List.ofSeq
            hits @ rerolls
        else if input.WoundModifiers.RerollOnes
        then 
            let nonOnes, ones = List.partition (fun r -> r > 1) rolls
            let rerolls = generate (List.length ones) |> List.ofSeq
            nonOnes @ rerolls
        else rolls

    let simulateWoundRolls input simResult =
        if simResult.Hits.TotalHits <= 0 then simResult
        else
            let hitsToRoll = SimResult.getRollableHitCount simResult
            let rolls = 
                generate hitsToRoll |> Seq.toList
                |> runRerolls input
            let successfulWounds, _ = rolls |> List.partition (fun r -> r >= input.ToWound)
            let criticalWounds, regularWounds = successfulWounds |> List.partition (fun r -> r >= input.WoundModifiers.CriticalWound)
            if input.WoundModifiers.Devastating
            then
                let criticalWounds = criticalWounds |> List.length
                let successfulWounds = regularWounds |> List.length
                let woundResult = WoundsResult.DevastatingWounds (criticalWounds, successfulWounds + simResult.Hits.AutoWounds)
                { simResult with Wounds = woundResult }
            else
                let criticalWounds = criticalWounds |> List.length
                let successfulWounds = regularWounds |> List.length
                let woundResult = WoundsResult.RegularWounds <| criticalWounds + successfulWounds + simResult.Hits.AutoWounds
                { simResult with Wounds = woundResult }
