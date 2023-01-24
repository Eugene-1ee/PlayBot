const { REST, Routes } = require( 'discord.js' );
require( 'dotenv' ).config( );

const commands = [ ].map( command => command.toJSON )

const rest = new REST( { version : '10' } ).setToken( process.env.TOKEN );

( async ( ) =>
{
    try
    {
        console.log( '\nAttempt to delete command on Global..' );

        await rest.put( Routes.applicationCommands( process.env.clientId, process.env.guildId ), { body : commands } );

        console.log( 'Command Delete Successful on Global!\n' );
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
