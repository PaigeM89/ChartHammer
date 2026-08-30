namespace ChartHammer

module DiceParser =
    open XParsec
    open XParsec.CharParsers

    let staticModifierParser = parser {
        do! spaces
        let! operator = anyOf ['+'; '-' ]
        do! spaces
        let! staticModifier = pint32

        return (operator, staticModifier)
    }

    let diceStringParser = parser {
        do! spaces
        let! diceCount = pint32
        do! spaces
        do! skipChar 'd'
        do! spaces
        let! sides = pint32

        let! (operator, modifier) = staticModifierParser <|>% ('+', 0)

        return
            match operator with
            | '+' -> Types.DiceRoll (diceCount, sides, modifier)
            | '-' -> Types.DiceRoll (diceCount, sides, 0 - modifier)
            | _ -> Types.DiceRoll (diceCount, sides, 0)
    }

    let tryParse input =
        let reader = Reader.ofString input ()
        
        match diceStringParser reader with
        | XParsec.ParseResult.Ok x -> Ok x
        | XParsec.ParseResult.Error e ->
            // todo: logging
            Error $"Unable to parse input %s{input}"


    // parses common, simple dice rolling expressions, such as "2d6 + 6", "2d3", or "10d6 - 10"
    let runTest input = 
        let reader = Reader.ofString input ()
        diceStringParser reader