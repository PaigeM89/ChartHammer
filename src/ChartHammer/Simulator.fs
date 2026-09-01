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
            /// This many hits skip the step to see if they wound.
            AutoWounds : float
            /// If the attack has Hazardous, this is the count of natural 1s rolled.
            HitNaturalOnes : float
            Rerolls : float
        }
    with
        static member Default() = {
            NaturalHits = 0.0
            SustainedHits = 0.0
            AutoWounds = 0.0
            HitNaturalOnes = 0.0
            Rerolls = 0.0
        }
        member this.AddHitsResult (hitsResult : HitsResult) = 
            { this with
                NaturalHits = this.NaturalHits + float hitsResult.NaturalHits
                SustainedHits = this.SustainedHits + float hitsResult.SustainedHits
                AutoWounds = this.AutoWounds + float hitsResult.AutoWounds
                HitNaturalOnes = this.HitNaturalOnes + float hitsResult.HitNaturalOnes
                Rerolls = this.Rerolls + float hitsResult.Rerolls
            }
        member this.Normalize runCount =
            { this with
                NaturalHits = this.NaturalHits / runCount
                SustainedHits = this.SustainedHits / runCount
                AutoWounds = this.AutoWounds / runCount
                HitNaturalOnes = this.HitNaturalOnes / runCount
                Rerolls = this.Rerolls / runCount
            }
        member this.TotalHits = this.NaturalHits + this.SustainedHits + this.AutoWounds


    type AggregateWoundsResult = {
        /// Wounds that allow a save.
        RegularWounds : float
        /// Wounds that do not allow a save.
        AutoDamage : float
        /// The number of dice rerolled, if any.
        Rerolls : float
    } with
        static member Empty() = {
            RegularWounds = 0.0
            AutoDamage  = 0.0
            Rerolls = 0.0
        }

        member this.AddWoundsResult (wr : WoundsResult) =
            { this with
                RegularWounds = this.RegularWounds + float wr.RegularWounds
                AutoDamage = this.AutoDamage + float wr.AutoDamage
                Rerolls = this.Rerolls + float wr.Rerolls
            }

        member this.Normalize count =
            { this with
                RegularWounds = this.RegularWounds / count
                AutoDamage = this.AutoDamage / count
                Rerolls = this.Rerolls / count
            }
        member this.TotalWounds = this.RegularWounds + this.AutoDamage
        
    type Variance = {
        AttackVariance : double
        HitVariance : double
        WoundVariance : double
        UnsavedWoundVariance : double
        DamageVariance : double
    } with
        static member Empty() = {
            AttackVariance = 0.0
            HitVariance = 0.0
            WoundVariance = 0.0
            UnsavedWoundVariance = 0.0
            DamageVariance = 0.0
        }

        member this.Normalize count = 
            { this with
                AttackVariance = this.AttackVariance / count
                HitVariance = this.HitVariance / count
                WoundVariance = this.WoundVariance / count
                UnsavedWoundVariance = this.UnsavedWoundVariance / count
                DamageVariance = this.DamageVariance / count
            }

    type AggregateSimResult =
        {
            AttackCount : float
            Hits : AggregateHitsResult
            Wounds : AggregateWoundsResult
            UnsavedWoundCount : float
            DamageTotal : float
            MortalWounds : float
            ModelsDestroyed : float
            Variance : Variance
        }
    with
        static member Default() = {
            AttackCount = 0.0
            Hits = AggregateHitsResult.Default()
            Wounds = AggregateWoundsResult.Empty()
            UnsavedWoundCount = 0.0
            DamageTotal = 0.0
            MortalWounds = 0.0
            ModelsDestroyed = 0.0
            Variance = Variance.Empty()
        }

        member this.AddSimResult (simResult : SimulationResult) = 
            { this with
                AttackCount = this.AttackCount + float simResult.AttackCount
                Hits = this.Hits.AddHitsResult simResult.Hits
                Wounds = this.Wounds.AddWoundsResult simResult.Wounds
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
                UnsavedWoundCount = this.UnsavedWoundCount / runCount
                DamageTotal = this.DamageTotal / runCount
                MortalWounds = this.MortalWounds / runCount
                ModelsDestroyed = this.ModelsDestroyed / runCount
            }


    let private foldAndAggregateResults results count =
        let foldedResult =
            results
            |> Seq.fold (fun (aggregateSimResult : AggregateSimResult) simResult ->
                aggregateSimResult.AddSimResult simResult
            ) (AggregateSimResult.Default())
        foldedResult.Normalize count

    let private aggregateWithVariance results count =
        let foldedResult = foldAndAggregateResults results count
        let attacksVariance =
            let s =
                results |> Seq.sumBy (fun sr -> (float sr.AttackCount - foldedResult.AttackCount) ** 2.0)
            s / count
        let hitsVariance =
            let s =
                results
                |> Seq.sumBy (fun sr ->
                    (float sr.Hits.NaturalHits - foldedResult.Hits.NaturalHits) ** 2.0
                )
            s / count
        let woundVariance = 0.0
        let unsavedWoundVariance =
            let s =
                results |> Seq.sumBy (fun sr -> (float sr.UnsavedWoundCount - foldedResult.UnsavedWoundCount) ** 2.0)
            s / count
        let damageVariance =
            let s =
                results |> Seq.sumBy (fun sr -> (float sr.DamageTotal - foldedResult.DamageTotal) ** 2.0)
            s / count
        let variance = 
            { Variance.Empty() with
                AttackVariance = attacksVariance
                HitVariance = hitsVariance
                WoundVariance = woundVariance
                UnsavedWoundVariance = unsavedWoundVariance
                DamageVariance = damageVariance
            }
        { foldedResult with Variance = variance }

    let private aggregateWithVarianceTwo results count =
        let foldedResult = foldAndAggregateResults results count
        let variance = 
            results
            |> Seq.fold (fun variance simResult ->
                { variance with
                    AttackVariance = variance.AttackVariance + ((float simResult.AttackCount - foldedResult.AttackCount) ** 2.0)
                    HitVariance = variance.HitVariance + ((float simResult.Hits.TotalHits - foldedResult.Hits.TotalHits) ** 2.0)
                    WoundVariance = variance.WoundVariance + ((float simResult.Wounds.TotalWounds - foldedResult.Wounds.TotalWounds) ** 2.0)
                    UnsavedWoundVariance = variance.UnsavedWoundVariance + ((float simResult.UnsavedWoundCount - foldedResult.UnsavedWoundCount) ** 2.0)
                    DamageVariance = variance.DamageVariance + ((float simResult.DamageTotal - foldedResult.DamageTotal) ** 2.0)
                }
            ) (Variance.Empty())
        { foldedResult with Variance = variance.Normalize count }

    let simulateNTimes input count =
        let results =
            seq {
                for _ in 1..count do
                    simulateFullAttack input
            }
        if input.CalculateVariance
        then aggregateWithVarianceTwo results count
        else foldAndAggregateResults results count
