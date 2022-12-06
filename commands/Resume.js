const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data: new SlashCommandBuilder()
        .setName( "resume" )
        .setDescription( "일시정지된 노래를 재개합니다" ),
        
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
		else if ( queue.connection.paused == true )
		{
			queue.setPaused( false );
            
            await interaction.editReply( { embeds : [ 
            new MessageEmbed()
            .setDescription( "▶ Music resumed!" )
            .setColor( '#e38796' ) ] } );
		}
		else if ( queue.connection.paused == false )
		{
            await interaction.editReply( { embeds : [ 
            new MessageEmbed()
            .setDescription( "▶ It's playing!" )
            .setColor( '#bc95fc' ) ] } );
		}
	}
};