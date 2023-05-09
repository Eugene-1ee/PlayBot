const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );

const { erremb } = require( '../util/embed.js' );
const { songcheck, usercheck } = require( '../util/check.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

module.exports = {
	data: new SlashCommandBuilder()
		.setName( '정지' )
		.setDescription( '음악을 일시정지합니다. 다시 실행하면 재개합니다.' ),
    
	async execute( interaction )
    {
        if ( songcheck( interaction ) )
        {
            interaction.reply( { embeds: [ erremb( '재생 중인 노래가 없습니다!' ) ] } );
            return;
        }

        const permit = usercheck( interaction )
        if ( permit )
        {
            interaction.reply( { embeds: [ permit ] } );
            return;
        }

        if ( player[interaction.guild.id].pause( ) )
        {
            const embed = new EmbedBuilder( )
            .setColor( '#383838' )
            .setTitle( '일시정지했습니다!' );

            interaction.reply( { embeds: [ embed ] } );
            return;
        }
        else
        {
            player[interaction.guild.id].unpause( );
            
            const embed = new EmbedBuilder( )
            .setColor( '#383838' )
            .setTitle( '재개했습니다!' );

            interaction.reply( { embeds: [ embed ] } );
            return;
        }
    }
}