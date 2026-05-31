namespace ChartHammer

open System

module Generator =
    let random = System.Random()

    let rollCustomDie sides = random.Next(sides - 1) + 1

    let rollCustomDice count sides = seq { for i in 1..count do rollCustomDie sides }

    let rand() = random.Next(5) + 1

    let generate count = 
        seq {
            for i in 1..count do rand()
        }

