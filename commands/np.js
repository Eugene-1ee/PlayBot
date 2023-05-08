const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );

const timeConvert = require( '../util/timeConvert' );
const { erremb } = require( '../util/embed' );
const { musiccheck } = require('../util/check');

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'np' )
        .setDescription( '현재 재생중인 노래에 대한 정보를 표시합니다' ),

    async execute( interaction )
    {
        if ( musiccheck( interaction ) )
        {
            interaction.reply( { embeds : [ erremb( '재생 목록이 없습니다.') ] } );
            return;
        }

        const currentSong = playlist[ interaction.guild.id ][ 0 ];
        const time = timeConvert( Number( playlist[ interaction.guild.id ][ 0 ].length ) );
        const playtime = timeConvert( parseInt( player[ interaction.guild.id ]._state.playbackDuration / 1000 ) );
        
        const num =  11 - Math.round( 11 * ( ( Number( playlist[ interaction.guild.id ][ 0 ].length ) - parseInt( player[ interaction.guild.id ]._state.playbackDuration / 1000 ) ) / Number( playlist[ interaction.guild.id ][ 0 ].length ) ) );
        let bar = '▬▬▬▬▬▬▬▬▬▬▬▬';
        bar = bar.substring( 0, num ) + ':radio_button:' + bar.substring( num + 1 );

        console.log( ( process.memoryUsage().heapUsed / 1024 / 1024 ) + 'mb' );

        const embed = new EmbedBuilder()
            .setTitle( `Now Playing` )
            .setThumbnail( `https://img.youtube.com/vi/${currentSong.id}/mqdefault.jpg` )
            .setDescription( `[${currentSong.title}](https://www.youtube.com/watch?v=${currentSong.id})\n\n${playtime}  ` + bar + `  ${time}` )
            .setColor( '#9080a1' )
            .setFooter( { text: currentSong[ 'user' ].username + '#' + currentSong[ 'user' ].discriminator } )
            .setAuthor(
                {
                    name : currentSong.author.name,
                    iconURL : currentSong.author.thumbnails.at( -1 ).url,
                    url : currentSong.author.channel_url
                } );

        await interaction.reply( { embeds : [ embed ] } );
        return;
    }
};
