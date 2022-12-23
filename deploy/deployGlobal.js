const fs = require( 'fs' );
const { REST, Routes } = require( 'discord.js' );
const { clientId, token } = require( '../config.json' );


const commands = [ ];
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles )
{
    console.log( `${file} Registering on Global...` );
    
    const command = require( `../commands/${file}` );
    commands.push( command.data.toJSON( ) );

    console.log( `Success!` );
}

const rest = new REST( { version : '10' } ).setToken( token );

( async ( ) =>
{
    try
    {
        console.log( 'Attempting to refresh on Global...' );

        await rest.put( Routes.applicationCommands( clientId ), { body : commands } );

        console.log( 'Refresh succeeded on Global!');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
