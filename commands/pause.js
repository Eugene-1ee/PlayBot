const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );

const { erremb } = require( '../util/embed.js' );
const { songcheck, usercheck } = require( '../util/check.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( '정지' )
		.setDescription( '음악을 일시정지합니다. 재실행시 재개합니다.' ),
    
	async execute( interaction )
    {
        if ( songcheck( interaction ) )
        {
            interaction.reply( { embeds: [ erremb( '재생 중인 노래가 없습니다!' ) ] } );
            return;
        }

        if ( !usercheck( interaction ) )
        {
            interaction.reply( '통화방 이슈 발생' );
            return;
        }

        if ( player[interaction.guild.id].pause( ) )
        {
            interaction.reply( '일시정지됨' );
            return;
        }
        else
        {
            player[interaction.guild.id].unpause( );
            interaction.reply( '재개됨' );
            return;
        }
    }
}