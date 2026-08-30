namespace ChartHammer

module WoundRolls =
    open ChartHammer.Types
    open Generator

    let private runRerolls input rolls =
        if input.WoundModifiers |> List.contains WoundModifier.RerollFailures
        then
            let hits, misses = List.partition (fun r -> r >= input.ToWound) rolls
            let rerolls = generate (List.length misses) |> List.ofSeq
            hits @ rerolls
        else if input.WoundModifiers |> List.contains WoundModifier.RerollOnes
        then 
            let nonOnes, ones = List.partition (fun r -> r = 1) rolls
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
            if input.WoundModifiers |> List.contains Devastating
            then
                let devWounds, otherWounds = successfulWounds |> List.partition (fun r -> r = 6)
                { simResult with
                    DevastatingWounds = devWounds |> List.length
                    RegularWounds = (otherWounds |> List.length) + simResult.Hits.AutoWounds
                }
            else
                { simResult with
                    RegularWounds = (successfulWounds |> List.length) + simResult.Hits.AutoWounds
                }