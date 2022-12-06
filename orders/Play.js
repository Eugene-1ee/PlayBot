const { MessageEmbed } = require( "discord.js" );
const { QueryType } = require( "discord-player" );
const { prefix } = require( '../assets/config.json' );

module.exports = {
	data : [ 'ㅔ', 'play', 'p' ],
	async execute( message, client )
	{
        if ( !message.member.voice.channel ) //음성채널 접속 확인
        {
            const Embed = new MessageEmbed()
            .setDescription( `Please go into the voice channel first!` )
            .setColor( '#ff0000' );

            await message.reply( { embeds : [ Embed ] } );
        }
        else if ( message.content.replace( prefix, '' ).split( ' ' ).length == 1 )
        {
            const Embed = new MessageEmbed()
            .setDescription( `No word!` )
            .setColor( '#ff0000' );

            await message.reply( { embeds : [ Embed ] } );
        }
        else
        {
            const queue = await client.player.createQueue( message.guild );

            const messageContent = message.content.split( ' ' );
            messageContent.shift();
            const url = messageContent.toString().replace( /,/gi, ' ' );

            let connection;

            if ( !queue.connection && message.member.voice.channel.joinable == false )
            {
                const Embed = new MessageEmbed()
                .setDescription( `${message.member.voice.channel}\nI can't join the channel!` )
                .setColor( '#9aa1c9' );

                await message.reply( { embeds : [ Embed ] } );
                    
                queue.destroy();

                return;
            }
            else if ( !queue.connection )
            {
                await queue.connect( message.member.voice.channel );
                await console.log( `#${queue.connection.channel.name} 음성채널 접속` );

                connection = true;
            }
            else if ( message.member.voice.channel !== queue.connection.channel ) //같은 통화방인지 확인
            {
                const Embed = new MessageEmbed()
                .setDescription( `I'm playing music on ${queue.connection.channel}!` )
                .setColor( '#ff0000' );

                await message.reply( { embeds : [ Embed ] } );

                return;
            }
            
            if ( url.indexOf( 'youtube.com/playlist?list=' ) !== -1 ) // 검색 내용이 재생목록 링크일 경우
            {
                const result = await client.player.search ( url,
                {
                    requestedBy: message.author.id,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST
                } );
                    
                if ( result.tracks.length === 0 )
                {
                    const Embed = new MessageEmbed()
                    .setDescription( `No results!` )
                    .setColor( '#9aa1c9' );

                    await message.reply( { embeds : [ Embed ] } );
                }
                else
                {
                    const playlist = result.playlist;
                        
                    await queue.addTracks( result.tracks );

                    const text = `:white_check_mark: **${playlist.title}** successfully added!`;

                    const Embed = new MessageEmbed()
                    .setDescription( `**[${playlist.title}](${playlist.url})**\n\n${result.tracks.length} song` )
                    .setThumbnail( playlist.thumbnail )
                    .setColor( '#d395f9' )
                    .setFooter( { text : `Added by ${message.author.username + '#' + message.author.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp` } );

                    await message.reply( { content : text, embeds : [ Embed ] } );

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
                    requestedBy: message.author.id,
                    searchEngine: QueryType.AUTO
                } );
                    
                if ( result.tracks.length === 0 )
                {
                    await message.reply( { embeds : [ 
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
                    .setThumbnail( song.thumbnail )
                    .setDescription( `[${song.title}](${song.url})\n\nDuration : ${song.duration}` )
                    .setColor( '#996ae4' )
                    .setFooter( { text : `Added by ${message.author.username + '#' + message.author.discriminator}` , iconURL : `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp` } );

                    await message.reply( { content : text, embeds : [ Embed ] } );

                    if ( connection )
                    {
                        await queue.play();
                    }
                }
            }
        }
    }
}