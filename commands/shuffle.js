const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

const { erremb } = require( '../util/embed.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );
const { songcheck, usercheck } = require('../util/check.js');

module.exports =
{
	data: new SlashCommandBuilder( )
		.setName( '셔플' )
		.setDescription( '대기열에 있는 영상의 재생 순서를 섞습니다.' ),
    
	async execute( interaction )
    {
        if ( songcheck( interaction ) )
        {
            interaction.reply( { embeds: [ erremb( '재생 중인 노래가 없습니다!' ) ] });
            return;
        }

        const permit = usercheck( interaction )
        if ( permit )
        {
            interaction.reply( { embeds: [permit] } );
            return;
        }

        if ( !playlist[ interaction.guild.id ][ 1 ] )
        {
            interaction.reply( { embeds: [ erremb( '섞을 노래가 없습니다!' ) ] });
            return;
        }

        let shuffled = Object.keys( playlist[ interaction.guild.id ] );
        shuffled = shuffled.sort( ( ) => Math.random( ) - 0.5 );

        let unter = 1;
        let temp_playlist = new Map( );

        temp_playlist[ 0 ] = playlist[ interaction.guild.id ][ 0 ];

        for ( let row of shuffled )
        {
            if ( row == 0 )
            {
                continue;
            }
            temp_playlist[ unter ] = playlist[ interaction.guild.id ][ row ];
            unter++;
        }

        playlist[ interaction.guild.id ] = temp_playlist;

        let res = '';

        let temp_unter = 1, song = 0, count = 0;

        for ( let unter in playlist[ interaction.guild.id ] )
        {
            if ( temp_unter > 20 )
            {
                song++;
            }
            else if( count !== 0 )
            {
                res += '**`' + temp_unter + '`** ' + playlist[ interaction.guild.id ][ unter ][ 'title' ] + '\n';
                temp_unter++;
            }
            count++;
        }

        if ( song > 0 )
        {
            res += `\n**..외 ${song}개의 노래**`;
        }

        const plistemb = new EmbedBuilder( )
            .setColor( '#D8D8D8' )
            .setTitle( `:twisted_rightwards_arrows:  노래 ${count - 1}개의 재생 순서를 변경했습니다.` )
            .setDescription( res );

        interaction.reply( { embeds: [ plistemb ] } );
        return;
    }
}