const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data : [ 'resume' ],
	async execute( message, client )
	{
		const queue = client.player.getQueue( message.guildId );

		if ( !queue ) //대기열 확인
        {
            return;
        }
		else if ( message.member.voice.channel !== queue.connection.channel ) //같은 통화방인지 확인
        {
            await message.reply( { embeds : [ 
                new MessageEmbed()
                .setDescription( `You can only interact on ${queue.connection.channel}!` )
                .setColor( '#ff0000' )
            ] } );
        }
		else if ( queue.connection.paused == true )
		{
			queue.setPaused( false );
            
            await message.reply( { embeds : [ 
            new MessageEmbed()
            .setDescription( "▶ Music resumed!" )
            .setColor( '#e38796' ) ] } );
		}
		else if ( queue.connection.paused == false )
		{
            await message.reply( { embeds : [ 
            new MessageEmbed()
            .setDescription( "▶ It's playing!" )
            .setColor( '#bc95fc' ) ] } );
		}
    }
}