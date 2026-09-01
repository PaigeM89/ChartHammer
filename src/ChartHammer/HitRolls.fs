namespace ChartHammer

open ChartHammer.Types

module HitRolls =

    let private getSustainedHits input rolls  =
        if input.HitModifiers.SustainedHits > 0
        then
            let sixesCount = rolls |> List.filter (fun r ->  r >= input.HitModifiers.CriticalHit) |> List.length
            sixesCount * input.HitModifiers.SustainedHits
        else 0

    /// Partitions the rolls into critical hits (counted as lethal hits) and regular hits
    let private getLethalHits input rolls =
        if input.HitModifiers.LethalHits
        then
            let criticalHits = rolls |> List.filter (fun x -> x >= input.HitModifiers.CriticalHit) |> List.length
            let filteredList = rolls |> List.filter (fun x -> x < input.HitModifiers.CriticalHit)
            criticalHits, filteredList
        else 0, rolls

    let simulateHitRolls input simResult =
        if input.HitModifiers.Torrent
        then 
            let hitsResult = { HitsResult.Empty() with NaturalHits = simResult.AttackCount }
            { simResult with Hits = hitsResult }
        else
            let rerollsResult =
                Generator.generate simResult.AttackCount
                |> Seq.toList
                |> Helpers.applyRerolls input.ToHit input.HitModifiers.RerollFailures input.HitModifiers.RerollOnes
            let sustainedHitsCount = getSustainedHits input rerollsResult.NewRolls
            // filter out the sixes at this point, so we don't double count them when determining successful hits
            let lethalHitsCount , filteredRolls= getLethalHits input rerollsResult.NewRolls
            let hazardousRollsCount = filteredRolls |> List.filter (fun x -> x = 1) |> List.length
            let hitCount = filteredRolls |> List.filter (fun x -> x <> 1 && x >= input.ToHit) |> List.length

            let hitsResult = 
                { HitsResult.Empty() with
                    NaturalHits = hitCount
                    SustainedHits = sustainedHitsCount
                    AutoWounds = lethalHitsCount
                    HitNaturalOnes = hazardousRollsCount
                    Rerolls = rerollsResult.RerollCount
                }

            { simResult with Hits = hitsResult }