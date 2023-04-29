const fs = require( "node:fs" );
const path = require( "node:path" );
const { Client, Collection, Events, GatewayIntentBits } = require( "discord.js" );
require( "dotenv" ).config( );

const client = new Client(
{
    intents :
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
} );

client.on( "warn", console.warn );
client.on( "error", console.error );
client.on( "shardDisconnect", ( event, id ) =>
    console.log( "Bot Shard " + id + " disconnected (" + event.code + ") " + event + ", trying to reconnect..." ) );
client.on( "shardReconnecting", ( id ) =>
    console.log( "Bot Shard " + id + " reconnecting..." ) );

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

// Processing Errors
client.on( Events.ShardError, error => {
	console.error( 'A websocket connection encountered an error:', error );
});

process.on( "unhandledRejection", async ( err ) => {
    //console.error( "Unhandled Promise Rejection:\n", err );
});
process.on( "uncaughtException", async ( err ) => {
    //console.error( "Uncaught Promise Exception:\n", err );
});
process.on( "uncaughtExceptionMonitor", async ( err ) => {
    //console.error( "Uncaught Promise Exception (Monitor):\n", err );
});
process.on( "multipleResolves", async ( type, promise, reason ) => {
    // console.error( "Multiple Resolves:\n", type, promise, reason );
});

// Log in to Discord with your client's token
client.login( process.env.TOKEN );