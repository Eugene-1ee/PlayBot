const { SlashCommandBuilder, EmbedBuilder } = require( 'discord.js' );
const Audio = require( '../modules/audio' );
const timeConvert = require( '../modules/timeConvert' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'np' )
        .setDescription( 'Displays information about the music currently being played' ),

    async execute( interaction )
    {
        await interaction.deferReply( );
        
        const audio = new Audio( interaction.guildId );

        if ( audio.status.playing === true )
        {
            const currentSong = audio.playlist[ 0 ];
            const time = timeConvert( Number( audio.playlist[0].lengthSeconds ) );
            const playtime = timeConvert( parseInt( audio.player._state.playbackDuration / 1000 ) );

            const num =  11 - Math.round( 11 * ( ( Number( audio.playlist[0].lengthSeconds ) - parseInt( audio.player._state.playbackDuration / 1000 ) ) / Number( audio.playlist[0].lengthSeconds ) ) );
            let bar = '▬▬▬▬▬▬▬▬▬▬▬▬';
            bar = bar.substring( 0, num ) + ':radio_button:' + bar.substring( num + 1 );

            const embed = new EmbedBuilder()
            .setTitle( `Now Playing` )
            .setThumbnail( currentSong.thumbnails.at( -1 ).url )
            .setDescription( `[${currentSong.title}](${currentSong.video_url})\n\n${playtime}  ` + bar + `  ${time}` )
            .setColor( '#9080a1' )
            .setAuthor(
            {
                name : currentSong.author.name,
                iconURL : currentSong.author.thumbnails.at( -1 ).url,
                url : currentSong.author.channel_url
            } );

            await interaction.editReply( { embeds : [ embed ] } );
        }
        else
        {
            await interaction.editReply( 'There is no music playing' );
        }
    }
};