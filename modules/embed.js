const { EmbedBuilder } = require( 'discord.js' );
const timeConvert = require( './timeConvert' );

class Embed
{
    songPlay( song )
    {
        const embed = new EmbedBuilder( )
        .setColor( '#64ff6e' )
        .setTitle( `Now Playing` )
        .setThumbnail( song.thumbnails.at( -1 ).url )
        .setDescription( `[${song.title}](${song.video_url})` )
        .setFooter( { text : `Duration: ${timeConvert( song.lengthSeconds )}` } )
        .setAuthor(
        {
            name : song.author.name,
            iconURL : song.author.thumbnails.at( -1 ).url,
            url : song.author.channel_url
        } );;

        return embed;
    }
    
    songAdd( song )
    {
        const embed = new EmbedBuilder( )
        .setColor( 0x0099FF )
        .setTitle( song.title )
        .setURL( song.video_url )
        .setAuthor(
        {
            name : song.author.name,
            iconURL : song.author.thumbnails.at( -1 ).url,
            url : song.author.channel_url
        } )
        .setFooter( { text : `Duration: ${timeConvert( song.lengthSeconds )}` } )
        .setThumbnail( song.thumbnails.at( -1 ).url );

        return embed;
    }

    playlist( queue, time )
    {
        const currentSong = queue[ 0 ];
        const currentTime = timeConvert( queue[0].lengthSeconds - time );

        let queueString = '';
        for ( let i = 1; queue[ i ]; i++ )
        {
            queueString += `\`${ i }\` [${ queue[ i ].title }](${ queue[ i ].video_url }) ${ timeConvert( queue[ i ].lengthSeconds ) } \n`;
            if ( queueString.length > 3600 )
            {
                queueString += `**and ${ queue.length - i - 1 } songs**`
                break;
            }
        }
        
        if ( !queueString ) //When there are no songs in the queue:
        {
            const embed = new EmbedBuilder( )
            .setTitle( `Music Queue` )
            .setDescription( `**Now Playing**\n[${currentSong.title}](${currentSong.video_url}) ${currentTime} left` )
            .setThumbnail( currentSong.thumbnails.at( -1 ).url )
            .setColor( '#9080a1' );

            return embed;
        }
        else if ( queueString ) //When there are songs in the queue:
        {
            const embed = new EmbedBuilder( )
            .setTitle( `Music Queue (${queue.length - 1} tracks)` )
            .setDescription( `**Now Playing**\n[${currentSong.title}](${currentSong.video_url}) ${currentTime} left\n\n${queueString}` )
            .setThumbnail( currentSong.thumbnails.at( -1 ).url )
            .setColor( '#9080a1' );

            return embed;
        }
    }
}

module.exports = Embed;