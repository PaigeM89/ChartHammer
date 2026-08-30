namespace ChartHammer.API

open FsToolkit.ErrorHandling
open ChartHammer.Types
open ChartHammer.Simulation
open ChartHammer.API.DTOs

module Transforms =

    let private parseAttacks (str : string) =
        match System.Int32.TryParse str with
        | true, x -> AttacksInput.StaticValue x |> Ok
        | false, _ -> ChartHammer.DiceParser.tryParse str

    
    let private parseHitModifier (modifierName : string, modifierValue) =
        match modifierName.ToLowerInvariant() with
        | "torrent" -> Torrent  |> Ok
        | "targetinstealth" -> TargetInStealth  |> Ok
        | "lethalhits" -> LethalHits  |> Ok
        | "sustainedhits" -> SustainedHits modifierValue  |> Ok
        | "hazardous" -> Hazardous  |> Ok
        | "rerollones" -> HitModifier.RerollOnes  |> Ok
        | "rerollfailures" -> HitModifier.RerollFailures |> Ok
        | _ -> Error $"Unable to parse hit modifier: %s{modifierName}"

    let private parseHitModifiers (modifiers : (string * int) list) =
        modifiers |> List.traverseResultM parseHitModifier

    let transformDtoToDomain (dto : SimulationInputDto) = 
        result {
            let! attacksInput = parseAttacks dto.Attacks
            //let! hitModifiers = parseHitModifiers dto.HitModifiers

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
                        }
                    ToWound = dto.ToWound
                    CriticalWound = dto.CriticalWound
                    WoundModifiers = 
                        [
                            if dto.WoundModifiers.DevastatingWounds
                            then yield WoundModifier.Devastating
                        ]
                    ToSave = dto.ToSave
                    DamagePerHit = dto.DamagePerHit
                    DamageModifiers = []
                    EnemyModelHitPoints = dto.EnemyModelHitPoints
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

    let transformResultToDto (simResult : AggregateSimResult) =
        {
            SimResultDto.AttackCount = simResult.AttackCount
            Hits = transformHitsResultToDto simResult.Hits
            Wounds = transformWoundsResultToDto simResult.Wounds
            UnsavedWounds = simResult.UnsavedWoundCount
            DamageTotal = simResult.DamageTotal
            MortalWounds = simResult.MortalWounds
            ModelsDestroyed = simResult.ModelsDestroyed
        }