namespace ChartHammer


module List =
    let splitBy f li =
        let rec traverse accLeft accRight rem =
            match rem with
            | [] -> accLeft, accRight
            | x :: rem ->
                if f x
                then traverse (x :: accLeft) accRight rem
                else traverse accLeft (x :: accRight) rem
        traverse [] [] li

module Helpers =
    open ChartHammer

    type RerollsResult = {
        NewRolls : int list
        RerollCount : int
    }

    let applyRerolls successValue failuresProp onesProp rolls =
        if failuresProp
        then
            let successes, failures = rolls |> List.splitBy (fun x -> x >= successValue)
            let rerolls = Generator.generate (List.length failures) |> Seq.toList
            { 
                NewRolls = successes @ rerolls
                RerollCount = List.length failures
            }
        else if onesProp
        then
            let greaterThanOne, equalToOne = rolls |> List.splitBy (fun x -> x > 1)
            let rerolls = Generator.generate (List.length equalToOne) |> Seq.toList
            { 
                NewRolls = greaterThanOne @ rerolls
                RerollCount = List.length equalToOne
            }
        else 
            {
                NewRolls = rolls
                RerollCount = 0
            }