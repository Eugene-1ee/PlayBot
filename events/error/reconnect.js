const { Events } = require( 'discord.js' );

module.exports =
{
    name : Events.ShardReconnecting,
    async execute( id )
    {
        console.log( 'Bot Shard ' + id + ' reconnecting...' );
    }
}