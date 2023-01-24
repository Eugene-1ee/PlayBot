const fs = require( 'fs' );
const { REST, Routes } = require( 'discord.js' );
require( 'dotenv' ).config( );

const commands = [ ];
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles )
{
    console.log( `\n${file} Registering on Guild...` );
    
    const command = require( `../commands/${file}` );
    commands.push( command.data.toJSON( ) );

    console.log( `Success!\n` );
}

const rest = new REST( { version : '10' } ).setToken( process.env.TOKEN );

( async ( ) =>
{
    try
    {
        console.log( '\nAttempting to refresh on Guild...' );

        await rest.put( Routes.applicationGuildCommands( process.env.clientId, process.env.guildId ), { body : commands } );

        console.log( 'Refresh succeeded on Guild!\n');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
