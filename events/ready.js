const { Events, ActivityType } = require( 'discord.js' );
const fs = require( 'fs' );

module.exports =
{
    name : Events.ClientReady,
    once : true,
    execute( client )
    {
        const files = fs.readdirSync( 'assets/temp' ).filter( file => file.endsWith( '.json' ) );
        
        for ( const file of files )
        {
            fs.rm( `assets/temp/${ file }`,{ recursive: true }, err =>
            {
                throw err;
            } );
        }

        client.user.setActivity( { name: '무언가', type: ActivityType.Playing } );

        console.log( `Ready! Logged in as ${ client.user.tag }` );
    },
};