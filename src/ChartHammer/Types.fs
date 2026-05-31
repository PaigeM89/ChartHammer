namespace ChartHammer

module Types =
    
    type AttacksInput =
    | StaticValue of int
    | DiceRoll of diceSides : int * diceCount : int * staticModifier : int

    // type AttackModifier =
    // | Blast
    // | RapidFire of int

    type HitModifier =
    // auto-hit, skip the whole step
    | Torrent
    // -1 to hit
    | TargetInStealth
    | LethalHits
    | Heavy
    | SustainedHits of int
    | Hazardous
    | RerollOnes
    | RerollFailures
    
    type WoundModifier =
    // | TwinLinked
    // | Lance
    | Devastating
    | RerollOnes
    | RerollFailures

    type DamageModifier =
    | Melta of int

    type SimulationInput = {
        Attacks: AttacksInput
        ToHit: int
        HitModifiers : HitModifier list
        ToWound: int
        WoundModifiers : WoundModifier list
        ToSave: int
        DamagePerHit: int
        DamageModifiers : DamageModifier list
        EnemyModelHitPoints : int
    }

    type HitsResult = {
        /// Hits from roll results, not from any additional rules.
        NaturalHits : int
        /// Hits added to the pool from the Sustained Hits rule.
        SustainedHits : int
        /// Of the hits generated, this many hits skip the step to see if they wound.
        AutoWounds : int
        /// If the attack has Hazardous, this is the count of natural 1s rolled.
        HitNaturalOnes : int
    } with
        static member Empty() = {
            NaturalHits = 0
            SustainedHits = 0
            AutoWounds = 0
            HitNaturalOnes = 0
        }
        /// The total number of hits.
        member this.TotalHits = this.NaturalHits + this.SustainedHits
        member this.RollableHits = this.NaturalHits - this.AutoWounds + this.SustainedHits

    type SimulationResult = {
        AttackCount : int
        Hits : HitsResult

        DevastatingWounds : int
        RegularWounds : int

        UnsavedWoundCount : int
        DamageTotal: int
        /// treated as a subset of "damage total"
        MortalWounds : int
        ModelsDestroyed : int
    } with
        static member Empty() = {
            AttackCount = 0
            Hits = HitsResult.Empty()
            DevastatingWounds = 0
            RegularWounds = 0
            UnsavedWoundCount = 0
            DamageTotal = 0
            MortalWounds = 0
            ModelsDestroyed = 0
        }

    module SimResult =
        let getRollableHitCount simResult = simResult.Hits.RollableHits
        
        let getTotalSaveRolls simResult = simResult.Hits.TotalHits

