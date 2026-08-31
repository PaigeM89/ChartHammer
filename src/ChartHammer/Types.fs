namespace ChartHammer

module Types =

    type DiceRollInput =
    | StaticValue of int
    | DiceRoll of diceCount : int * diceSides : int * staticModifier : int

    type HitModifiers = {
        Torrent : bool
        LethalHits : bool
        SustainedHits : int
        RerollOnes : bool
        RerollFailures : bool
        Hazardous : bool
        CriticalHit : int
    } with
        static member Default() = {
            Torrent = false
            LethalHits = false
            SustainedHits = 0
            RerollOnes = false
            RerollFailures = false
            Hazardous = false
            CriticalHit = 6
        }

    type WoundModifiers = {
        Devastating : bool
        RerollOnes : bool
        RerollFailures : bool
        CriticalWound : int
    }

    type DamageModifier =
    | Melta of int

    type SimulationInput = {
        Attacks: DiceRollInput
        ToHit: int
        HitModifiers : HitModifiers
        ToWound: int
        WoundModifiers : WoundModifiers
        ToSave: int
        Damage : DiceRollInput
        DamageModifiers : DamageModifier list
        EnemyModelHitPoints : int
        CalculateVariance : bool
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
        /// If there was any reroll rule applied, this is the number of dice re-rolled.
        Rerolls : int
    } with
        static member Empty() = {
            NaturalHits = 0
            SustainedHits = 0
            AutoWounds = 0
            HitNaturalOnes = 0
            Rerolls = 0
        }
        /// The total number of hits.
        member this.TotalHits = this.NaturalHits + this.SustainedHits
        member this.RollableHits = this.NaturalHits - this.AutoWounds + this.SustainedHits

    type WoundsResult =
    | RegularWounds of int
    | DevastatingWounds of skipAllSaves : int * regularWounds : int

    type SimulationResult = {
        AttackCount : int
        Hits : HitsResult

        Wounds: WoundsResult

        UnsavedWoundCount : int
        DamageTotal: int
        /// Separate value from Damage Total
        MortalWounds : int
        ModelsDestroyed : int
    } with
        static member Empty() = {
            AttackCount = 0
            Hits = HitsResult.Empty()
            Wounds = WoundsResult.RegularWounds 0
            UnsavedWoundCount = 0
            DamageTotal = 0
            MortalWounds = 0
            ModelsDestroyed = 0
        }

    module SimResult =
        let getRollableHitCount simResult = simResult.Hits.RollableHits
        
        let getTotalSaveRolls simResult = //simResult.RegularWounds + simResult.CriticalWounds
            match simResult.Wounds with
            | WoundsResult.RegularWounds x -> x
            | WoundsResult.DevastatingWounds(_, x) -> x
