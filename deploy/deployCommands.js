const fs = require( 'fs' );
const { REST } = require( '@discordjs/rest' );
const { Routes } = require( 'discord-api-types/v9' );
const { clientID, token } = require( '../assets/config.json' );

const commands = [ ];
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles )
{
    console.log( `전역 명령 ${file} 등록 시도...` );
    const command = require( `../commands/${file}` );
    commands.push( command.data.toJSON( ) );
    console.log( `전역 명령 ${file} 등록 성공!` );
}

const rest = new REST( { version : '9' } ).setToken( token );

( async ( ) =>
{
    try
    {
        console.log( '전역 명령 새로 고침 시도...' );

        await rest.put( Routes.applicationCommands( clientID ), { body : commands } );

        console.log( '전역 명령 새로 고침 성공!');
    }
    catch ( error )
    {
        console.error( error );
    }
} )( );
