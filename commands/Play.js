const { SlashCommandBuilder } = require( "@discordjs/builders" );
const { MessageEmbed } = require( "discord.js" );
const { QueryType } = require( "discord-player" );

module.exports = {
    data : new SlashCommandBuilder()
        .setName( "play" )
        .setDescription( "유튜브에서 노래를 재생합니다" )
        .addStringOption( option => option
            .setName( "검색" )
            .setDescription( "영상/재생목록의 링크 또는 검색어를 입력해주세요" )
            .setRequired( true ) ),

async execute( interaction, client )
{
    await interaction.deferReply();

    if ( !interaction.member.voice.channel ) //음성채널 접속 확인
    {
        const Embed = new MessageEmbed()
        .setDescription( `Please go into the voice channel first!` )
        .setColor( '#ff0000' );

        await interaction.editReply( { embeds : [ Embed ] } );
    }
    else
    {
        const queue = await client.player.createQueue( interaction.guild );

        const url = interaction.options.getString( "검색" );

        let connection;

        if ( !queue.connection && interaction.member.voice.channel.joinable == false )
        {
            const Embed = new MessageEmbed()
            .setDescription( `${interaction.member.voice.channel}\nI can't join the channel!` )
            .setColor( '#9aa1c9' );

            await interaction.editReply( { embeds : [ Embed ] } );
                    
            queue.destroy();

            return;
        }
        else if ( !queue.connection )
        {
            await queue.connect( interaction.member.voice.channel );
            await console.log( `#${queue.connection.channel.name} 음성채널 접속` );

            connection = true;
        }
        else if ( interaction.member.voice.channel !== queue.connection.channel ) //같은 통화방인지 확인
        {
            const Embed = new MessageEmbed()
            .setDescription( `I'm playing music on ${queue.connection.channel}!` )
            .setColor( '#ff0000' );

            await interaction.editReply( { embeds : [ Embed ] } );

            return;
        }
            
        if ( url.indexOf( 'youtube.com/playlist?list=' ) !== -1 ) // 검색 내용이 재생목록 링크일 경우
        {
            const result = await client.player.search ( url,
            {
                requestedBy: interaction.user.id,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            } );
                    
            if ( result.tracks.length === 0 )
            {
                const Embed = new MessageEmbed()
                .setDescription( `No results!` )
                .setColor( '#9aa1c9' );

                await interaction.editReply( { embeds : [ Embed ] } );
            }
            else
            {
                const playlist = result.playlist;
                        
                await queue.addTracks( result.tracks );

                const text = `:white_check_mark: **${playlist.title}** successfully added!`;

                const Embed = new MessageEmbed()
                .setDescription( `**[${playlist.title}](${playlist.url})**\n\n${result.tracks.length} song` )
                .setColor( '#d395f9' )
                .setFooter( { text : `Added by ${interaction.user.username + '#' + interaction.user.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp` } );

                await interaction.editReply( { content : text, embeds : [ Embed ] } );

                if ( connection )
                {
                    await queue.play();
                }
            }
        }
        else //재생목록 링크가 아닐 경우
        {
            const result = await client.player.search( url, 
            {
                requestedBy: interaction.user.id,
                searchEngine: QueryType.AUTO
            } );
                    
            if ( result.tracks.length === 0 )
            {
                await interaction.editReply( { embeds : [ 
                    new MessageEmbed()
                    .setDescription( `No results!` )
                    .setColor( '#9aa1c9' )
                ] } );
            }
            else
            {
                const song = result.tracks[0];
                        
                await queue.addTrack( song );

                const text = `:white_check_mark: **${song.title}** successfully added!`;
                        
                const Embed = new MessageEmbed()
                .setDescription( `[${song.title}](${song.url})\n\nDuration : ${song.duration}` )
                .setColor( '#996ae4' )
                .setFooter( { text : `Added by ${interaction.user.username + '#' + interaction.user.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp` } );

                await interaction.editReply( { content : text, embeds : [ Embed ] } );

                if ( connection )
                {
                    await queue.play();
                }
            }
        }
    }
} } 