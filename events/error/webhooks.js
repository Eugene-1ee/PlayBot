const { Events } = require( 'discord.js' );

module.exports =
{
    name : Events.WebhooksUpdate,
    async execute( update )
    {
        console.log( 'Webhooks Update:\n', update );
    }
}