namespace ChartHammer

open ChartHammer.Types

module HitRolls =
    
    let private getSustainedHits input rolls  =
        if input.HitModifiers.SustainedHits > 0
        then
            let sixesCount = rolls |> List.filter (fun r -> r = 6) |> List.length
            sixesCount * input.HitModifiers.SustainedHits
        else 0

    let private getLethalHits input rolls =
        if input.HitModifiers.LethalHits
        then
            let sixesCount = rolls |> List.filter (fun x -> x = 6) |> List.length
            let filteredList = rolls |> List.filter (fun x -> x <> 6)
            sixesCount, filteredList
        else 0, rolls

    let private applyHitRerolls input rolls =
        if input.HitModifiers.RerollFailures
        then
            let successes, failures = rolls |> List.splitBy (fun x -> x >= input.ToHit)
            let rerolls = Generator.generate (List.length failures) |> Seq.toList
            successes @ rerolls
        else if input.HitModifiers.RerollOnes
        then
            let greaterThanOne, equalToOne = rolls |> List.splitBy (fun x -> x > 1)
            let rerolls = Generator.generate (List.length equalToOne) |> Seq.toList
            greaterThanOne @ rerolls
        else rolls
        

    let simulateHitRolls input simResult =
        if input.HitModifiers.Torrent
        then 
            let hitsResult = { HitsResult.Empty() with NaturalHits = simResult.AttackCount }
            { simResult with Hits = hitsResult }
        else
            let rolls =
                Generator.generate simResult.AttackCount
                |> Seq.toList
                |> applyHitRerolls input 
            let sustainedHitsCount = getSustainedHits input rolls
            // filter out the sixes at this point, so we don't double count them when determining successful hits
            let lethalHitsCount , filteredRolls= getLethalHits input rolls
            let hazardousRollsCount = filteredRolls |> List.filter (fun x -> x = 1) |> List.length
            let hitCount = filteredRolls |> List.filter (fun x -> x <> 1 && x >= input.ToHit) |> List.length

            let hitsResult = 
                { HitsResult.Empty() with
                    NaturalHits = hitCount + lethalHitsCount
                    SustainedHits = sustainedHitsCount
                    AutoWounds = lethalHitsCount
                    HitNaturalOnes = hazardousRollsCount
                }

            { simResult with Hits = hitsResult }