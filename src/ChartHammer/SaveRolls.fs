namespace ChartHammer

module SaveRolls =
    open ChartHammer.SharedTypes.Types
    open Generator

    let simulateSaveRolls input simResult =
        let saveRollCount = SimResult.getTotalSaveRolls simResult
        if saveRollCount <= 0
        then simResult
        else
            let rolls = generate saveRollCount |> Seq.toList
            let _, unsuccessfulSaves = rolls |> List.partition (fun r -> r >= input.ToSave)
            { simResult with UnsavedWoundCount = List.length unsuccessfulSaves }