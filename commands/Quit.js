const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data: new SlashCommandBuilder()
        .setName( "quit" )
        .setDescription( "대기열을 비우고 봇을 음성방에서 내보냅니다" ),
        
	async execute( interaction, client )
    {
        await interaction.deferReply();

		const queue = client.player.getQueue( interaction.guildId );

		if ( !queue ) //재생 여부 확인
        {
            await interaction.editReply( { content : "https://media.discordapp.net/attachments/559983592374009866/937299771499094037/20211112_103826.gif", ephemeral : true } );
        }
        else if ( interaction.member.voice.channel !== queue.connection.channel ) //같은 통화방인지 확인
        {
            await interaction.editReply( { embeds : [ 
                new MessageEmbed()
                .setDescription( `You can only interact on ${queue.connection.channel}!` )
                .setColor( '#ff0000' ) ] } );
        }
        else // 대기열 파괴, 봇 나감
        {
		    queue.destroy();

            await interaction.editReply( { embeds: [
                new MessageEmbed()
                .setDescription( `⛔ 대기열을 없애버렸어!\n**잘 있거라!**` )
                .setColor( '#000000' ) ] } );
        }
	}
};