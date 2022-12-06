const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data: new SlashCommandBuilder()
        .setName( "pause" )
        .setDescription( "노래를 일시정지합니다" ),
        
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
		else if ( queue.connection.paused == false )
		{
			queue.setPaused( true );
            
            await interaction.editReply( { embeds : [ 
            new MessageEmbed()
            .setDescription( "⏸ Music paused!\nIf you want to resume, enter **/resume**" )
            .setColor( '#e38796' ) ] } );
		}
		else if ( queue.connection.paused == true )
		{
            await interaction.editReply( { embeds : [ 
            new MessageEmbed()
            .setDescription( "⏸ It's already paused." )
            .setColor( '#bc95fc' ) ] } );
		}
	}
};