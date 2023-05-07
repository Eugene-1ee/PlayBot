const { EmbedBuilder } = require( 'discord.js' );
const timeConvert = require( './timeConvert' );
let { connection, player, playlist, resource, volume, station } = require( '../functions/val.js' );

/**
 * 단순 에러 임베드
 * @param { string } message 에러 메시지
 * @returns 임베드
 */
function erremb( message )
{
    const errembed = new EmbedBuilder( )
    // .setColor('#0x7d3640')
        .setTitle( message );

    return errembed;
}

/**
 * 에러 임베드
 * @param { string } title 제목
 * @param { string } sub 설명
 * @returns 임베드
 */
function norpembed( title, sub )
{
    const norpbed = new EmbedBuilder( )
    // .setColor('#0x7d3640')
        .setTitle( title )
        .setDescription( sub );

    return norpbed;
};

/**
 * 대기열 임베드
 * @param {} interaction
 * @param { number } page 대기열 현재 페이지
 * @returns 임베드
 */
function queue( interaction, page )
{
    let queue = [];
    let a = 0;

    for ( let unter in playlist[ interaction.guild.id ] )
    {
        queue[ a ] =
        {
            'title': `${playlist[ interaction.guild.id ][ unter ][ 'title' ]}`,
            'id': `${playlist[ interaction.guild.id ][ unter ][ 'id' ]}`,
            'length': `${playlist[ interaction.guild.id ][ unter ][ 'length' ]}`,
            'user': `${playlist[ interaction.guild.id ][ unter ][ 'user' ]}`,
        };

        a++;
    }
    
    const currentSong = queue[ 0 ];
    const currentTime = timeConvert( Number( currentSong.length ) - parseInt( player[ interaction.guild.id ]._state.playbackDuration / 1000 ) );
    
    if ( queue.length == 1 ) //When there are no songs in the queue:
    {
        const embed = new EmbedBuilder( )
        .setTitle( `Music Queue (0 tracks)` )
        .setDescription( `**Now Playing**\n[${currentSong.title}](https://www.youtube.com/watch?v=${currentSong.id}) ${currentTime} left\n-${currentSong.user}` )
        .setThumbnail( `https://img.youtube.com/vi/${currentSong.id}/mqdefault.jpg` )
        // .setColor( '#9080a1' );

        return embed;
    }
    else
    {
        const newQueue = queue.slice( 1, queue.length );

        const totalPages = Math.ceil( newQueue.length / 10 ) || 1;

        const queueString = newQueue.slice( page * 10, page * 10 + 10 ).map( ( song, i ) => 
        {
            return `\`${ page * 10 + i + 1 }\` [${song.title}](https://www.youtube.com/watch?v=${song.id}) \`\`${timeConvert( song.length )}\`\`\n-${ song.user }`;
        } ).join( '\n' );

        const embed = new EmbedBuilder( )
            .setTitle( `Music Queue (${queue.length - 1} tracks)` )
            .setDescription( `**Now Playing**\n[${currentSong.title}](https://www.youtube.com/watch?v=${currentSong.id}) ${currentTime} left -${currentSong.user}\n\n${queueString}` )
            .setThumbnail( `https://img.youtube.com/vi/${currentSong.id}/mqdefault.jpg` )
        // .setColor( '#9080a1' )
            .setFooter( { text: `Page ${page + 1}/${totalPages}` } );

        return embed;
    }
};

module.exports =
{
    erremb: erremb,
    norpembed: norpembed,
    queue: queue
};