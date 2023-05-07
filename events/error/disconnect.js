const { Events } = require( 'discord.js' );

module.exports =
{
    name : Events.ShardDisconnect,
    async execute( event, id )
    {
        console.log( 'Bot Shard ' + id + ' disconnected (' + event.code + ') ' + event + ', trying to reconnect...' );
    }
}