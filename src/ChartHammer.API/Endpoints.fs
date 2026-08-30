namespace ChartHammer.API

open ChartHammer.API.DTOs
open Microsoft.AspNetCore.Http
open Oxpecker

module Handlers =
    open System.Threading.Tasks

    let SIMULATION_COUNT = 10_000

    let runSimulation (ctx : HttpContext) =
        task {
            let! simInput = ctx.BindJson<SimulationInputDto>()
            printfn "%A" simInput

            let input = Transforms.transformDtoToDomain simInput

            match input with
            | Error msg ->
                return ctx.WriteText msg
            | Ok input ->
                let simResult = ChartHammer.Simulation.simulateNTimes input SIMULATION_COUNT
                return ctx.WriteJson (Transforms.transformResultToDto simResult)
        } :> Task

module Endpoints =

    let getEndpoints() = [
        POST [
            route "/simulate" Handlers.runSimulation
        ]
    ]