module.exports =
{
    name : "uncaughtExceptionMonitor",
    async execute( error )
    {
        console.log( "Uncaught Promise Exception (Monitor):\n", error.message );
    }
}