// Require the necessary discord.js classes
const fs = require( 'node:fs' );
const path = require( 'node:path' );
require( 'dotenv' ).config();

const { Client, Collection, Events, GatewayIntentBits } = require( 'discord.js' );
const { funcPrefix } = require( './assets/config.json' );

// Create a new client instance
const client = new Client(
{ 
    intents : 
    [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
} );

// Registering Commands
client.commands = new Collection( );

const commandsPath = path.join( __dirname, 'commands' );
const commandFiles = fs.readdirSync( commandsPath ).filter( file => file.endsWith( '.js' ) );

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
}

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
}

// Run Game File
client.func = new Collection( );
const funcFiles = fs.readdirSync( './func' ).filter( file => file.endsWith( '.js' ) );

for ( const file of funcFiles ) 
{
    const func = require( `./func/${ file }` );
    let Num = 0;
    while ( Num < func.data.length )
    {
        client.func.set( func.data[ Num ], func );
        Num++;
    }
};

client.on( Events.MessageCreate, async message =>
{
    const func = client.func.get( message.content.replace( funcPrefix, '' ).split( ' ' )[ 0 ] );

    const blacklist = JSON.parse( fs.readFileSync( 'assets/blacklist.json' ) );

    console.log( `(#${ message.channel.name }) <${ message.author.tag }> ${ message.content }` );
    
    if ( message.author.bot )
    {
        return;
    }

    if ( message.content.startsWith( funcPrefix ) )
    {
        if ( blacklist.indexOf( message.author.id ) != -1 )
        {
            message.author.send( '너 정지됨\n관리자한테 문의 ㄱ' );
            return;
        }

        const Checked = fs.existsSync( `assets/data/${ message.author.id }.json` );

        if ( !Checked )
        {
            if ( message.content == `${ funcPrefix }등록` )
            {
                try
                { 
                    func.execute( message );
                }
                catch ( error )
                {
                    console.error( error );
                }
            }
            else if ( func )
            {
                message.reply( `여러가지 기능을 사용하려면 **!등록**을 해야 해!` );
            }
        }
        else if ( func )
        {
            try
            { 
                func.execute( message );
            }
            catch ( error )
            {
                console.error( error );
            }
        }
    }
} );

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