namespace ChartHammer

open ChartHammer.SharedTypes.Types

module HitRolls =
    
    let private getSustainedHits input rolls  =
        let sustainedHitsValue =
            let rec traverse modifiers =
                match modifiers with
                | [] -> None
                | modifier :: modifiers ->
                    match modifier with
                    | SustainedHits x -> Some x
                    | _ -> traverse modifiers
            traverse input.HitModifiers
        sustainedHitsValue
        |> Option.map (fun s ->
            let sixesCount = rolls |> List.filter (fun r -> r = 6) |> List.length
            sixesCount * s
        )
        |> Option.defaultValue 0

    let private getLethalHits input rolls =
        if input.HitModifiers |> List.contains LethalHits
        then
            let sixesCount = rolls |> List.filter (fun x -> x = 6) |> List.length
            let filteredList = rolls |> List.filter (fun x -> x <> 6)
            sixesCount, filteredList
        else 0, rolls

    let private applyHitRerolls input hitModifier rolls =
        if input.HitModifiers |> List.contains HitModifier.RerollFailures
        then
            let modifiedRolls = rolls |> List.map (fun x -> x + hitModifier)
            let successes, failures = modifiedRolls |> List.splitBy (fun x -> x >= input.ToHit)
            let rerolls = Generator.generate (List.length failures) |> Seq.toList
            successes @ rerolls
        else if input.HitModifiers |> List.contains HitModifier.RerollOnes
        then
            let greaterThanOne, equalToOne = rolls |> List.splitBy (fun x -> x > 1)
            let rerolls = Generator.generate (List.length equalToOne) |> Seq.toList
            greaterThanOne @ rerolls
        else rolls
        

    let simulateHitRolls input simResult =
        if input.HitModifiers |> List.contains Torrent
        then 
            let hitsResult = { HitsResult.Empty() with NaturalHits = simResult.AttackCount }
            { simResult with Hits = hitsResult }
        else
            let rollModifier =
                let rec reduceModifiers acc modifiers =
                    match modifiers with
                    | [] -> acc
                    | m :: t ->
                        match m with
                        | TargetInStealth -> max -1 (acc - 1)
                        | Heavy -> min 1 (acc + 1)
                        | _ -> reduceModifiers acc t

                reduceModifiers 0 input.HitModifiers
            let rolls =
                Generator.generate simResult.AttackCount
                |> Seq.toList
                |> applyHitRerolls input rollModifier
            let sustainedHitsCount = getSustainedHits input rolls
            // filter out the sixes at this point, so we don't double count them when determining successful hits
            let lethalHitsCount , filteredRolls= getLethalHits input rolls
            let hazardousRollsCount = filteredRolls |> List.filter (fun x -> x = 1) |> List.length
            // apply the modifier here because we're looking for roll results. Also remember natural 1s always miss.
            let hitCount = filteredRolls |> List.filter (fun x -> x <> 1 && (x + rollModifier) >= input.ToHit) |> List.length

            let hitsResult = 
                { HitsResult.Empty() with
                    NaturalHits = hitCount + lethalHitsCount
                    SustainedHits = sustainedHitsCount
                    AutoWounds = lethalHitsCount
                    HitNaturalOnes = hazardousRollsCount
                }

            { simResult with Hits = hitsResult }