const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data: new SlashCommandBuilder()
        .setName( "shuffle" )
        .setDescription( "대기열의 노래를 섞습니다" ),

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
			queue.shuffle();
			
            await interaction.editReply( { embeds : [ 
                new MessageEmbed()
                .setDescription( `🔀 ${queue.tracks.length} - 1 songs shuffled!\nTrack 1 doesn't shuffle -Bug` )
                .setColor( '#64cbff' ) ] } );
		}
	}
};