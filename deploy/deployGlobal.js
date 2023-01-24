const fs = require( 'fs' );
const { REST, Routes } = require( 'discord.js' );
require( 'dotenv' ).config( );

const commands = [ ];
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles )
{
    console.log( `\n${file} Registering on Global...` );

    const command = require( `../commands/${file}` );
    commands.push( command.data.toJSON( ) );

    console.log( `Success!\n` );   
}

const rest = new REST( { version : '10' } ).setToken( process.env.TOKEN );

( async ( ) =>
{
    try
    {
        console.log( '\nAttempting to refresh on Global...' );

        await rest.put( Routes.applicationCommands( process.env.clientId ), { body : commands } );

        console.log( 'Refresh succeeded on Global!\n');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
