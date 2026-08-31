namespace ChartHammer


module Generator =
    let random = System.Random()

    let rollCustomDie sides = random.Next(sides) + 1

    let rollCustomDice count sides = seq { for i in 0..(count - 1) do rollCustomDie sides }

    let rand() = random.Next(6) + 1

    let generate count = 
        seq {
            for i in 1..count do rand()
        }

