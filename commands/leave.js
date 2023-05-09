const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );

const { erremb } = require( '../util/embed.js' );
const { cleanup } = require( '../functions/cleanup.js' );
const { connectcheck, usercheck } = require( '../util/check.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( '나가' )
		.setDescription( '재생을 멈추고 통화방에서 나갑니다.' ),
    
	async execute( interaction )
    {
        if ( connectcheck( interaction ) )
        {
            interaction.reply( { embeds: [ erremb( '재생 중인 노래가 없습니다!' ) ] } );
            return;
        }
        
        const permit = usercheck( interaction )
        if ( permit )
        {
            interaction.reply( { embeds: [permit] } );
            return;
        }

        cleanup( interaction.guild.id );

        const embed = new EmbedBuilder( )
        .setTitle( `모든 음악의 재생이 끝났습니다` )
        .setDescription( '언제든 불러주세요!' )
        .setColor( '#535353' );
    
        await interaction.channel.send( { embeds: [ embed ] } );
        return;
    }
}