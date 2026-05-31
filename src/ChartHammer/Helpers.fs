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
