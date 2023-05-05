const { Events } = require( 'discord.js' );

module.exports =
{
    name : Events.Warn,
    async execute( warn )
    {
        console.log( 'Events Warn:\n', warn );
    }
}