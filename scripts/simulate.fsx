#r "../src/ChartHammer.SharedTypes/bin/Debug/net10.0/ChartHammer.SharedTypes.dll"
#r "nuget: FsHttp"
#r "nuget: FSharp.SystemTextJson"

open System.Net.Http
open System.Text.Json
open System.Text.Json.Serialization
open FsHttp
open ChartHammer.SharedTypes.DTOs

let simulationInput =
    {
        SimulationInputDto.Attacks = "2d6 + 6"
        ToHit = 3
        HitModifiers = [ ("SustainedHits", 1) ]
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