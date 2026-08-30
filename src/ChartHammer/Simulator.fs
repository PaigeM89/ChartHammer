namespace ChartHammer

module Simulation = 
    open ChartHammer
    open ChartHammer.Types
    
    let private simulateAttackCount input simResult =
        let attacks = 
            match input.Attacks with
            | StaticValue x -> x
            | DiceRoll (count,sides, modifier) ->
                let rollTotal = Generator.rollCustomDice count sides |> Seq.sum
                rollTotal + modifier
        { simResult with AttackCount = attacks }

    let simulateFullAttack input =
        SimulationResult.Empty()
        |> simulateAttackCount input
        |> HitRolls.simulateHitRolls input
        |> WoundRolls.simulateWoundRolls input
        |> SaveRolls.simulateSaveRolls input
        |> Damage.simulateDamage input


    type AggregateHitsResult =
        {
            /// Hits from roll results, not from any additional rules.
            NaturalHits : float
            /// Hits added to the pool from the Sustained Hits rule.
            SustainedHits : float
            /// Of the hits generated, this many hits skip the step to see if they wound.
            AutoWounds : float
            /// If the attack has Hazardous, this is the count of natural 1s rolled.
            HitNaturalOnes : float
        }
    with
        static member Default() = {
            NaturalHits = 0.0
            SustainedHits = 0.0
            AutoWounds = 0.0
            HitNaturalOnes = 0.0
        }
        member this.AddHitsResult (hitsResult : HitsResult) = 
            { this with
                NaturalHits = this.NaturalHits + float hitsResult.NaturalHits
                SustainedHits = this.SustainedHits + float hitsResult.SustainedHits
                AutoWounds = this.AutoWounds + float hitsResult.AutoWounds
                HitNaturalOnes = this.HitNaturalOnes + float hitsResult.HitNaturalOnes
            }
        member this.Normalize runCount =
            { this with
                NaturalHits = this.NaturalHits / runCount
                SustainedHits = this.SustainedHits / runCount
                AutoWounds = this.AutoWounds / runCount
                HitNaturalOnes = this.HitNaturalOnes / runCount
            }

    type AggregateWoundsResult =
        {
            DevastatingWounds : float
            RegularWounds : float
        } with
            static member Empty() = {
                DevastatingWounds = 0.0
                RegularWounds = 0.0
            }

            member this.AddWoundsResult (wr : WoundsResult) = 
                match wr with
                | RegularWounds x ->
                    { this with RegularWounds = this.RegularWounds + float x }
                | DevastatingWounds (d, r) ->
                    { this with
                        DevastatingWounds = this.DevastatingWounds + float d
                        RegularWounds = this.RegularWounds + float r
                    }

            member this.Normalize runCount =
                { this with
                    DevastatingWounds = this.DevastatingWounds / runCount
                    RegularWounds = this.RegularWounds / runCount
                }        
        
    type AggregateSimResult =
        {
            AttackCount : float
            Hits : AggregateHitsResult
            Wounds : AggregateWoundsResult
            // DevastatingWounds :float
            // CriticalWounds : float
            // RegularWounds : float
            UnsavedWoundCount : float
            DamageTotal : float
            MortalWounds : float
            ModelsDestroyed : float
        }
    with
        static member Default() = {
            AttackCount = 0.0
            Hits = AggregateHitsResult.Default()
            Wounds = AggregateWoundsResult.Empty()
            // DevastatingWounds = 0.0
            // CriticalWounds = 0.0
            // RegularWounds = 0.0
            UnsavedWoundCount = 0.0
            DamageTotal = 0.0
            MortalWounds = 0.0
            ModelsDestroyed = 0.0
        }

        member this.AddSimResult (simResult : SimulationResult) = 
            { this with
                AttackCount = this.AttackCount + float simResult.AttackCount
                Hits = this.Hits.AddHitsResult simResult.Hits
                Wounds = this.Wounds.AddWoundsResult simResult.Wounds
                // DevastatingWounds = this.DevastatingWounds + float simResult.DevastatingWounds
                // CriticalWounds = this.CriticalWounds + float simResult.CriticalWounds
                // RegularWounds = this.RegularWounds + float simResult.RegularWounds
                UnsavedWoundCount = this.UnsavedWoundCount + float simResult.UnsavedWoundCount
                DamageTotal = this.DamageTotal + float simResult.DamageTotal
                MortalWounds = this.MortalWounds + float simResult.MortalWounds
                ModelsDestroyed = this.ModelsDestroyed + float simResult.ModelsDestroyed
            }

        member this.Normalize runCount = 
            { this with 
                AttackCount = this.AttackCount / runCount
                Hits = this.Hits.Normalize runCount
                Wounds = this.Wounds.Normalize runCount
                // DevastatingWounds = this.DevastatingWounds / runCount
                // CriticalWounds = this.CriticalWounds / runCount
                // RegularWounds = this.RegularWounds / runCount
                UnsavedWoundCount = this.UnsavedWoundCount / runCount
                DamageTotal = this.DamageTotal / runCount
                MortalWounds = this.MortalWounds / runCount
                ModelsDestroyed = this.ModelsDestroyed / runCount
            }

    let simulateNTimes input count =
        let results =
            seq {
                for _ in 1..count do 
                    simulateFullAttack input
            }
        let foldedResult =
            results
            |> Seq.fold (fun (aggregateSimResult : AggregateSimResult) simResult ->
                aggregateSimResult.AddSimResult simResult
            ) (AggregateSimResult.Default())
        foldedResult.Normalize count
