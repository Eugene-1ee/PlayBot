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
            interaction.reply( { embeds : [ erremb( '재생 중인 노래가 없습니다!' ) ] } );
            return;
        }

        const currentSong = playlist[ interaction.guild.id ][ 0 ];
        const time = timeConvert( Number( playlist[ interaction.guild.id ][ 0 ].length ) );
        const playtime = timeConvert( parseInt( player[ interaction.guild.id ]._state.playbackDuration / 1000 ) );
        
        const num =  11 - Math.round( 11 * ( ( Number( playlist[ interaction.guild.id ][ 0 ].length ) - parseInt( player[ interaction.guild.id ]._state.playbackDuration / 1000 ) ) / Number( playlist[ interaction.guild.id ][ 0 ].length ) ) );
        let bar = '▬▬▬▬▬▬▬▬▬▬▬▬';
        bar = bar.substring( 0, num ) + ':radio_button:' + bar.substring( num + 1 );

        let mark = ':notes:';

        if ( station[ interaction.guild.id ] == 'repeat' )
        {
            mark = ':repeat:';
        }
        else if ( station[ interaction.guild.id ] )
        {
            mark = ':fire:';
        }

        const embed = new EmbedBuilder( )
            .setTitle( `${mark}  Now Playing` )
            .setThumbnail( `https://img.youtube.com/vi/${currentSong.id}/mqdefault.jpg` )
            .setDescription( `[${currentSong.title}](https://www.youtube.com/watch?v=${currentSong.id})\n\n${playtime}  ` + bar + `  ${time}` )
            .setColor( '#C7C7C7' )
            .setFooter( { text: `Added by ${currentSong.user.username}#${currentSong.user.discriminator}`, iconURL: currentSong.user.displayAvatarURL( ) } )
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
