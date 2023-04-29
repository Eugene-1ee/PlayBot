const { Events, ActivityType } = require( 'discord.js' );
const fs = require( 'fs' );

module.exports =
{
    name : Events.ClientReady,
    once : true,
    execute( client )
    {
        client.user.setActivity( { name: 'Piano', type: ActivityType.Listening } );

        console.log( `Ready! Logged in as ${ client.user.tag }` );
    },
};