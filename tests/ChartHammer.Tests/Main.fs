namespace ChartHammer.Tests

module ExpectoTemplate =

    open Expecto

    [<EntryPoint>]
    let main argv =
        Tests.runTestsInAssemblyWithCLIArgs [] argv
