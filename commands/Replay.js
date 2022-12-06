const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data: new SlashCommandBuilder()
        .setName( "replay" )
        .setDescription( "노래 반복을 토글합니다" ),
        
	async execute( interaction, client )
    {
        await interaction.deferReply();

		const queue = client.player.getQueue( interaction.guildId );

		if ( !queue ) //대기열 확인
        {
            return;
        }
		else if ( interaction.member.voice.channel !== queue.connection.channel ) //같은 통화방인지 확인
        {
            await interaction.editReply( { embeds : [ 
                new MessageEmbed()
                .setDescription( `You can only interact on ${queue.connection.channel}!` )
                .setColor( '#ff0000' )
            ] } );
        }
        else
        {
			if ( queue.repeatMode == 1 )
			{
				const currentSong = queue.current;
				queue.setRepeatMode( 0 );

				await interaction.editReply( { embeds : [ 
					new MessageEmbed()
					.setDescription( `⏩ [${currentSong.title}](${currentSong.url}) replay disabled!` )
					.setColor( '#78b7cc' ) ] } );
			}
			else
			{
				const currentSong = queue.current;
				queue.setRepeatMode( 1 );

				await interaction.editReply( { embeds : [ 
					new MessageEmbed()
					.setDescription( `🔂 [${currentSong.title}](${currentSong.url}) replayed!\nIf you enter a command again, replay will be disabled.` )
					.setColor( '#78b7cc' ) ] } );
			}
		}
	}
};