const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data: new SlashCommandBuilder()
        .setName( "remove" )
        .setDescription( "대기열에서 노래를 제거합니다." )
        .addNumberOption( option => option
            .setName( "번호" )
            .setDescription( "노래 번호" )
            .setMinValue( 1 )
            .setRequired( true ) ),
        
	async execute( interaction, client )
    {
        await interaction.deferReply();

		const queue = client.player.getQueue( interaction.guildId );

		if ( !queue ) //대기열 확인
        {
            await interaction.editReply( "There's no song." );
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
            const totalLength = queue.tracks.length
			const trackIndex = ( interaction.options.getNumber( "번호" ) || 1 ) - 1;

			if ( trackIndex % 1 !== 0 || trackIndex < 0 || trackIndex > totalLength - 1 || interaction.options.getNumber( "번호" ) == 0 )
			{
				await interaction.editReply( `There's no ${ interaction.options.getNumber( "번호" ) } song.\nThere are ${totalLength} songs in total.` );
			}
			else
			{
				const track = await queue.tracks[trackIndex];
				await queue.remove( trackIndex );

				await interaction.editReply( { embeds : [ 
            	    new MessageEmbed()
            	    .setDescription( `**Music deleted!**\n[${track.title}](${track.url})` )
            	    .setColor( '#8ede7a' )
                    .setFooter( { text : `Added by ${track.requestedBy.username + '#' + track.requestedBy.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${track.requestedBy.id}/${track.requestedBy.avatar}.webp` } ) ] } );
			}
        }
	}
};