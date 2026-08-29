#r "../src/ChartHammer.SharedTypes/bin/Debug/net10.0/ChartHammer.SharedTypes.dll"
#r "nuget: FsHttp"
#r "nuget: FSharp.SystemTextJson"

open System.Text.Json
open System.Text.Json.Serialization
open FsHttp
open ChartHammer.SharedTypes.DTOs

let simulationInput =
    {
        SimulationInputDto.Attacks = "20"
        ToHit = 3
        HitModifiers = [ ("SustainedHits", 1); ("RerollOnes", 0) ]
        ToWound = 3
        WoundModifiers = []
        ToSave = 5
        DamagePerHit = 3
        DamageModifiers = []
        EnemyModelHitPoints = 12
    }

let options = JsonSerializerOptions()
options.Converters.Add(JsonFSharpConverter())

let inputAsJson = JsonSerializer.Serialize(simulationInput, options)


printfn "Input as json:\n%s" inputAsJson

let sendPost() =
    http {
        POST "http://localhost:5000/simulate"
        CacheControl "no-cache"
        body
        json inputAsJson
    }

let sendRequest() =
    sendPost()
    |> Request.send
    |> Response.toText
    |> printfn "%A"