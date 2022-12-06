const { SlashCommandBuilder } = require( "@discordjs/builders" )
const { MessageEmbed } = require( "discord.js" )

module.exports = {
    data: new SlashCommandBuilder()
        .setName( "queue" )
        .setDescription( "노래의 진행 상황과 대기열을 보여줍니다" )
        .addNumberOption( option => option
            .setName( "페이지" )
            .setDescription( "대기열의 페이지" )
            .setMinValue( 1 ) ),

    async execute( interaction, client )
    {
        await interaction.deferReply();

        const queue = client.player.getQueue( interaction.guildId );
        
        if ( !queue || !queue.playing ) // 대기열 확인
        {
            await interaction.editReply( "There's no song waiting." );
        }
        else
        {
            const choosePage = interaction.options.getNumber( "페이지" ) ? 
                                interaction.options.getNumber( "페이지" ) : 1;

            if ( !Number( choosePage ) )
            {
                await interaction.editReply( `There are no ${ choosePage } pages in the queue.` );
                return;
            }

            const totalPages = Math.ceil( queue.tracks.length / 10 ) || 1;
            const page = ( choosePage || 1 ) - 1;

            if ( page > totalPages - 1 || page < 0 || page % 1 !== 0 || choosePage == 0 ) // 페이지가 이상한지 확인
            {
                await interaction.editReply( `There are no ${ choosePage } pages in the queue.\nThere is a maximum of ${totalPages} page.` );
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
                    .setColor( '#9080a1' );

                    await interaction.editReply( { embeds: [ Embed ] } );
                }
                else if ( queueString ) //대기열에 노래가 있을 때
                {
                    const Embed = new MessageEmbed()
                    .setTitle( `Music Queue (${queue.tracks.length} tracks)` )
                    .setDescription( `**Now Playing**\n[${currentSong.title}](${currentSong.url}) ${currentTime}-${currentSong.duration}\n\n${queueString}` )
                    .setColor( '#9080a1' )
                    .setFooter( { text: `Page ${page + 1}/${totalPages}` } );

                    await interaction.editReply( { embeds: [ Embed ] } );
                }
            }
        }
    }
};