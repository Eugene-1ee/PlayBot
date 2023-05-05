module.exports =
{
    name : "unhandledRejection",
    async execute( error )
    {
        console.log( "Unhandled Promise Rejection:\n", error );
    }
}