const { Events } = require( 'discord.js' );

module.exports =
{
    name : Events.ShardError,
    async execute( error )
    {
        console.log( 'A websocket connection encountered an error:\n', error );
    }
}