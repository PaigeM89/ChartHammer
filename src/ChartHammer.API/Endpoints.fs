namespace ChartHammer.API

open ChartHammer.SharedTypes.DTOs
open Microsoft.AspNetCore.Http
open Oxpecker

module Handlers =
    open System.Threading.Tasks

    let SIMULATION_COUNT = 10_000

    let runSimulation (ctx : HttpContext) =
        task {
            let! simInput = ctx.BindJson<SimulationInputDto>()
            
            printfn "%A" simInput

            return ctx.WriteText "Test response"
        } :> Task

module Endpoints =

    let getEndpoints() = [
        POST [
            route "/simulate" Handlers.runSimulation
        ]
    ]