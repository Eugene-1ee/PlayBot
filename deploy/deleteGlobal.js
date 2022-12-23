const { REST, Routes } = require( 'discord.js' );
const { clientId, guildId, token } = require( '../config.json' );

const commands = [ ].map( command => command.toJSON)

const rest = new REST( { version : '10' } ).setToken( token );

( async ( ) =>
{
    try
    {
        console.log( 'Attempt to delete command on Global...' );

        await rest.put( Routes.applicationCommands( clientId, guildId ), { body : commands } );

        console.log( 'Command Deletion Successful on Global!');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
