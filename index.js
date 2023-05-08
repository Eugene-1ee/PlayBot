const fs = require( "node:fs" );
const path = require( "node:path" );
const { Client, Collection, Events, GatewayIntentBits } = require( "discord.js" );
require( "dotenv" ).config( );

const client = new Client(
{
    intents :
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
} );
    
client.commands = new Collection( );

const commandsPath = path.join( __dirname, "commands" );
const commandFiles = fs.readdirSync( commandsPath ).filter( file => file.endsWith( ".js" ) );

for ( const file of commandFiles )
{
    const filePath = path.join( commandsPath, file );
	const command = require( filePath );

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ( 'data' in command && 'execute' in command )
    {
		client.commands.set( command.data.name, command );
	}
    else
    {
		console.log( `[WARNING] The command at ${ filePath } is missing a required "data" or "execute" property.` );
	}
};

// Running an event
const eventsPath = path.join( __dirname, 'events' );
const eventFiles = fs.readdirSync( eventsPath ).filter( file => file.endsWith( '.js' ) );

for ( const file of eventFiles )
{
    const filePath = path.join( eventsPath, file );
    const event = require( filePath );

	// Excute commands
    if ( event.once )
    {
        client.once( event.name, ( ...args ) => event.execute( ...args ) );
    }
    else
    {
        client.on( event.name, ( ...args ) => event.execute( ...args ) );
    }
};

// Running an error
const errorPath = path.join( __dirname, 'events/error' );
const errorFiles = fs.readdirSync( errorPath ).filter( file => file.endsWith( '.js' ) );

for ( const file of errorFiles )
{
    const filePath = path.join( errorPath, file );
    const event = require( filePath );

    client.on( event.name, ( ...args ) => event.execute( ...args ) );
};

// Running an debug
const debugPath = path.join( __dirname, 'events/debug' );
const debugFiles = fs.readdirSync( debugPath ).filter( file => file.endsWith( '.js' ) );

for ( const file of debugFiles )
{
    const filePath = path.join( debugPath, file );
    const debug = require( filePath );

    process.on( debug.name, ( ...args ) => debug.execute( ...args ) );
};

// process.on( "multipleResolves", async ( type, promise, reason ) => {
//     console.log( "Multiple Resolves:\n", type, promise, reason );
// });

// Log in to Discord with your client's token
client.login( process.env.TOKEN );