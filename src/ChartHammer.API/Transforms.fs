namespace ChartHammer.API

open FsToolkit.ErrorHandling
open ChartHammer.Types
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
            let! hitModifiers = parseHitModifiers dto.HitModifiers

            return 
                {
                    SimulationInput.Attacks = attacksInput
                    ToHit = dto.ToHit
                    HitModifiers = hitModifiers
                    ToWound = dto.ToWound
                    WoundModifiers = []
                    ToSave = dto.ToSave
                    DamagePerHit = dto.DamagePerHit
                    DamageModifiers = []
                    EnemyModelHitPoints = dto.EnemyModelHitPoints
                }
        }
        