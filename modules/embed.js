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

    playlist( queue, time, page )
    {
        const currentSong = queue[ 0 ];
        const currentTime = timeConvert( Number( currentSong.lengthSeconds ) - time );
        
        if ( queue.length == 1 ) //When there are no songs in the queue:
        {
            const embed = new EmbedBuilder( )
            .setTitle( `Music Queue (0 tracks)` )
            .setDescription( `**Now Playing**\n[${currentSong.title}](${currentSong.video_url}) ${currentTime} left` )
            .setThumbnail( currentSong.thumbnails.at( -1 ).url )
            .setColor( '#9080a1' );

            return embed;
        }
        else
        {
            const newQueue = queue.slice( 1, queue.length );

            const totalPages = Math.ceil( newQueue.length / 10 ) || 1;

            const queueString = newQueue.slice( page * 10, page * 10 + 10 ).map( ( song, i ) => 
            {
                return `\`${ page * 10 + i + 1 }\` [${song.title}](${song.video_url}) ${timeConvert( song.lengthSeconds )}`;
            } ).join( "\n" );

            const embed = new EmbedBuilder( )
            .setTitle( `Music Queue (${queue.length - 1} tracks)` )
            .setDescription( `**Now Playing**\n[${currentSong.title}](${currentSong.video_url}) ${currentTime} left\n\n${queueString}` )
            .setThumbnail( currentSong.thumbnails.at( -1 ).url )
            .setColor( '#9080a1' )
            .setFooter( { text: `Page ${page + 1}/${totalPages}` } );;

            return embed;
        }
    }
}

module.exports = Embed;