const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data : [ 'shuffle' ],
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
		else
		{
			queue.shuffle();
			
            await message.reply( { embeds : [ 
                new MessageEmbed()
                .setDescription( `🔀 ${queue.tracks.length} - 1 songs shuffled!\nTrack 1 doesn't shuffle -Bug` )
                .setColor( '#64cbff' ) ] } );
		}
    }
}