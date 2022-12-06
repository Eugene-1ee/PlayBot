const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data : [ 'skip' ],
	async execute( message, client )
	{
        const queue = client.player.getQueue( message.guildId );

		if (!queue) //대기열 확인
        {
            return;
        }
        else if ( message.member.voice.channel !== queue.connection.channel ) //같은 통화방인지 확인
        {
            await message.reply( { embeds : [ 
                new MessageEmbed()
                .setDescription( `I'm playing music on ${queue.connection.channel}!` )
                .setColor( '#ff0000' )
            ] } );
        }
        else // 재생중인 음악 스킵
        {
            const currentSong = queue.current;

		    queue.skip();
            
            await message.reply( { embeds: [
                new MessageEmbed()
                .setDescription( `**Skipped!**\n[${currentSong.title}](${currentSong.url})` )
                .setThumbnail( currentSong.thumbnail )
                .setColor( '#64ff6e' )
                .setFooter( { text : `Added by ${currentSong.requestedBy.username + '#' + currentSong.requestedBy.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${currentSong.requestedBy.id}/${currentSong.requestedBy.avatar}.webp` } ) ] } );
        }
    }
}