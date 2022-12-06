const { MessageEmbed } = require( "discord.js" );
const { prefix } = require( '../assets/config.json' );

module.exports = {
	data : [ 'ㅂ', 'queue', 'q' ],
	async execute( message, client )
	{
        const queue = client.player.getQueue( message.guildId );
        
        if ( !queue || !queue.playing ) // 대기열 확인
        {
            await message.reply( "There's no song waiting." );
        }
        else
        {
            const choosePage = ( message.content.replace( prefix, '' ).split( ' ' )[ 1 ] ? 
                                    message.content.replace( prefix, '' ).split( ' ' )[ 1 ] : 1 );

            if ( !Number( choosePage ) )
            {
                message.reply( `There are no ${ choosePage } pages in the queue.` );
                return;
            }

            const totalPages = Math.ceil( queue.tracks.length / 10 ) || 1;
            const page = ( choosePage || 1 ) - 1;

            if ( page > totalPages - 1 || page < 0 || page % 1 !== 0 || choosePage == 0 ) // 페이지가 이상한지 확인
            {
                await message.reply( `There are no ${ choosePage } pages in the queue.\nThere is a maximum of ${totalPages} page.` );
            }
            else
            {
                const queueString = queue.tracks.slice( page * 10, page * 10 + 10 ).map( ( song, i ) => 
                {
                    return `\`${ page * 10 + i + 1 }\` [${song.title}](${song.url}) ${song.duration}`
                } ).join( "\n" );

                const currentSong = queue.current;
                let currentTime;

                const seconds = parseInt( queue.connection.audioResource.playbackDuration / 1000 );
                const hour = parseInt( seconds / 3600 );
                const min = parseInt(( seconds % 3600 ) / 60 );
                const sec = seconds % 60 < 10 ? '0' + seconds % 60 : seconds % 60;
    
                if ( hour !== 0 ) //진행 시간 계산
                {
                    currentTime = `${hour}:${min}:${sec}`;
                }
                else
                {
                    currentTime = `${min}:${sec}`;
                }

                if ( !queueString ) //대기열에 노래가 없을 때
                {
                    const Embed = new MessageEmbed()
                    .setTitle( `Music Queue (${queue.tracks.length} tracks)` )
                    .setDescription( `**Now Playing**\n[${currentSong.title}](${currentSong.url}) ${currentTime}/${currentSong.duration}` )
                    .setThumbnail( currentSong.thumbnail )
                    .setColor( '#9080a1' );

                    await message.reply( { embeds: [ Embed ] } );
                }
                else if ( queueString ) //대기열에 노래가 있을 때
                {
                    const Embed = new MessageEmbed()
                    .setTitle( `Music Queue (${queue.tracks.length} tracks)` )
                    .setDescription( `**Now Playing**\n[${currentSong.title}](${currentSong.url}) ${currentTime}-${currentSong.duration}\n\n${queueString}` )
                    .setThumbnail( currentSong.thumbnail )
                    .setColor( '#9080a1' )
                    .setFooter( { text: `Page ${page + 1}/${totalPages}` } );

                    await message.reply( { embeds: [ Embed ] } );
                }
            }
        }
    }
}