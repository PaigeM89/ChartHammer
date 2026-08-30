namespace ChartHammer.API

open FsToolkit.ErrorHandling
open ChartHammer.Types
open ChartHammer.Simulation
open ChartHammer.API.DTOs

module Transforms =

    let private parseDiceString (str : string) =
        match System.Int32.TryParse str with
        | true, x -> DiceRollInput.StaticValue x |> Ok
        | false, _ -> ChartHammer.DiceParser.tryParse str

    let transformDtoToDomain (dto : SimulationInputDto) = 
        result {
            let! attacksInput = parseDiceString dto.Attacks
            let! damageInput = parseDiceString dto.Damage

            return 
                {
                    SimulationInput.Attacks = attacksInput
                    ToHit = dto.ToHit
                    HitModifiers = 
                        {
                            HitModifiers.Torrent = dto.HitModifiers.Torrent
                            LethalHits = dto.HitModifiers.LethalHits
                            SustainedHits = dto.HitModifiers.SustainedHits
                            RerollOnes = dto.HitModifiers.RerollOnes
                            RerollFailures = dto.HitModifiers.RerollFailures
                            Hazardous = dto.HitModifiers.Hazardous
                            CriticalHit = dto.HitModifiers.CriticalHit
                        }
                    ToWound = dto.ToWound
                    WoundModifiers = 
                        {
                            WoundModifiers.Devastating = dto.WoundModifiers.DevastatingWounds
                            RerollOnes = dto.WoundModifiers.RerollOnes
                            RerollFailures = dto.WoundModifiers.RerollFailures
                            CriticalWound = dto.WoundModifiers.CriticalWound
                        }
                    ToSave = dto.ToSave
                    Damage = damageInput
                    DamageModifiers = []
                    EnemyModelHitPoints = dto.EnemyModelHitPoints
                    CalculateVariance = true
                }
        }
        
    let private transformHitsResultToDto (hits : AggregateHitsResult) =
        {
            HitsResultDto.NaturalHits = hits.NaturalHits
            SustainedHits = hits.SustainedHits
            AutoWounds = hits.AutoWounds
            NaturalOnes = hits.HitNaturalOnes
        }

    let private transformWoundsResultToDto (wounds : AggregateWoundsResult) =
        {
            WoundsResultDto.RegularWounds = wounds.RegularWounds
            WoundsResultDto.DevastatingWounds = wounds.DevastatingWounds
        }

    let private transformVarianceToDto (variance : Variance) =
        {
            HitsVariance = variance.HitVariance
        }

    let transformResultToDto (simResult : AggregateSimResult) =
        {
            SimResultDto.AttackCount = simResult.AttackCount
            Hits = transformHitsResultToDto simResult.Hits
            Wounds = transformWoundsResultToDto simResult.Wounds
            UnsavedWounds = simResult.UnsavedWoundCount
            DamageTotal = simResult.DamageTotal
            MortalWounds = simResult.MortalWounds
            ModelsDestroyed = simResult.ModelsDestroyed
            Variance = transformVarianceToDto simResult.Variance
        }