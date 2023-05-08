const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

const { erremb } = require( '../util/embed.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );
const { songcheck, usercheck } = require('../util/check.js');

module.exports =
{
	data: new SlashCommandBuilder( )
		.setName( '셔플' )
		.setDescription( '재생목록에 담긴 영상의 재생 순서를 섞어요.' ),
    
	async execute( interaction )
    {
        if ( songcheck( interaction ) )
        {
            interaction.reply( { embeds: [ erremb( '재생 중인 노래가 없습니다!\n셔플은 노래를 재생하는 중에만 할 수 있습니다.' ) ] });
            return;
        }

        if ( !usercheck( interaction ) )
        {
            interaction.reply( '통화방 이슈 발생' );
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

        let temp_unter = 1;

        for ( let unter in playlist[ interaction.guild.id ] )
        {
            res += '**`' + temp_unter + '`** | ' + playlist[ interaction.guild.id ][ unter ][ 'title' ] + '\n';
            ++temp_unter;
        }

        const plistemb = new EmbedBuilder( )
        // .setColor('#0x7d3640')
            .setTitle( ':twisted_rightwards_arrows:  재생 순서를 변경했습니다.' )
            .setDescription( res )
            .setThumbnail( 'https://img.youtube.com/vi/' + playlist[ interaction.guild.id ][ 0 ][ 'id' ] + '/mqdefault.jpg' );

        interaction.reply( { embeds: [ plistemb ] } );
        return;
    }
}