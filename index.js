// 필요 파일 불러오기
const fs = require( 'fs' );
const { Client, Collection, Intents, MessageEmbed } = require( 'discord.js' );
const { Player } = require( "discord-player" );
const client = new Client( { intents : [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ] } );
const { token, prefix } = require( './assets/config.json' );

client.player = new Player( client, { ytdlOptions : { quality : "highestaudio" , highWaterMark : 1 << 25 } } );

// 이벤트 실행
const eventFiles = fs.readdirSync( './events' ).filter( file => file.endsWith( '.js' ) );

for ( const file of eventFiles )
{
    const event = require( `./events/${file}` );

    if ( event.once )
    {
        client.once( event.name, ( ...arg ) => event.execute( ...arg ) );
    }
    else
    {
        client.on( event.name, ( ...arg ) => event.execute( ...arg ) );
    }
};

// 명령어 실행
client.commands = new Collection();
const commandFiles = fs.readdirSync( './commands' ).filter( file => file.endsWith( '.js' ) );

for ( const file of commandFiles ) 
{
    const command = require( `./commands/${file}` );
    client.commands.set( command.data.name, command );
};

client.on( 'interactionCreate', async interaction =>
{
	const command = client.commands.get( interaction.commandName );

	if ( !command ) // 명령어가 아니면 캔슬
    {
        return; 
    }

	try //명령어 실행
    { 
        await command.execute( interaction, client );
    }
    catch ( error ) // 에러 발생시 에러 출력
    {
        await interaction.editReply( { content : '명령어를 실행 할 수 없습니다.', ephemeral : true } ); 

        console.error( error );
    }
} );

client.orders = new Collection();
const orderFiles = fs.readdirSync( './orders' ).filter( file => file.endsWith( '.js' ) );

for ( const file of orderFiles ) 
{
    const order = require( `./orders/${ file }` );
    let Num = 0;
    while ( Num < order.data.length )
    {
        client.orders.set( order.data[ Num ], order );
        Num++;
    }
};

client.on( 'messageCreate', async message =>
{
    const order = client.orders.get( message.content.replace( prefix, '' ).split( ' ' )[ 0 ] );

    if ( message.author.bot ) //봇이 보낸 메시지이면 캔슬
    {
        return;
    }
    
    if ( message.content.startsWith( prefix ) && order ) //메시지가 접두사로 시작할때
    {
        try
        { 
            order.execute( message, client );
        }
        catch ( error )
        {
            console.error( error );
        }
    }
} );

// 로그인
client.login( token );