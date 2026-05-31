namespace ChartHammer.API

open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Logging
open System.Text.Json
open System.Text.Json.Serialization
open Oxpecker

module Program =
    open System.Threading.Tasks

    let private errorHandler (ctx: HttpContext) (next: RequestDelegate) =
        task {
            try
                return! next.Invoke(ctx)
            with
            | :? ModelBindException
            | :? RouteParseException as ex ->
                let logger = ctx.GetLogger()
                logger.LogWarning(ex, "Unhandled 400 error")
                ctx.SetStatusCode StatusCodes.Status400BadRequest
                //return! ctx.WriteHtmlView(errorView 400 (string ex))
                return! ctx.WriteText "Error with route"
            | ex ->
                let logger = ctx.GetLogger()
                logger.LogError(ex, "Unhandled 500 error")
                ctx.SetStatusCode StatusCodes.Status500InternalServerError
                //return! ctx.WriteHtmlView(errorView 500 (string ex))
                return! ctx.WriteText "Error on server"
        } :> Task

    let private notFoundHandler (ctx: HttpContext) =
        let logger = ctx.GetLogger()
        logger.LogWarning("Unhandled 404 error")
        ctx.SetStatusCode 404
        //ctx.WriteHtmlView(errorView 404 "Page not found!")
        ctx.WriteText "Endpoint not found"

    let private serializerOptions =
        let jsonOptions = JsonSerializerOptions()
        jsonOptions.Converters.Add(JsonFSharpConverter())
        jsonOptions

    let configureServices (services: IServiceCollection) =
        services
            .AddCors(fun options -> options.AddDefaultPolicy(fun policy ->
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader() |> ignore))
            .AddRouting()
            .AddOxpecker() |> ignore

        services.AddSingleton<IJsonSerializer>(SystemTextJsonSerializer(serializerOptions)) |> ignore


    let configureApp (appBuilder: IApplicationBuilder) =
        appBuilder
            .UseRouting()
            .UseCors()
            .Use(errorHandler)
            .UseOxpecker(Endpoints.getEndpoints())
            .Run(notFoundHandler)

    [<EntryPoint>]
    let main args =
        let builder = WebApplication.CreateBuilder(args)
        configureServices builder.Services
        let app = builder.Build()
        configureApp app
        app.Run()
        0