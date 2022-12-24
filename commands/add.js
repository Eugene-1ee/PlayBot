const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );
const Embed = require( '../modules/embed' );
const ytpl = require( 'ytpl' );
const ytdl = require( 'ytdl-core' );
const YouTube = require( 'youtube-node' );
const { youtubeApiKey } = require( '../config.json' );
const youtube = new YouTube( );
youtube.setKey( youtubeApiKey );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'add' )
        .setDescription( '대기열에 노래를 추가합니다' )
        .addStringOption( option => option
            .setName( 'search' )
            .setDescription( '노래의 제목/URL 또는 재생목록의 URL을 입력해주세요' )
            .setRequired( true ) ),

    async execute( interaction )
    {
        await interaction.deferReply( );

        const url = interaction.options.getString( 'search' );

        const audio = new Audio( interaction.guildId );

        if ( !getVoiceConnection( interaction.guildId ) )
        {
            interaction.editReply( '봇이 음성채널에 연결되어 있지 않습니다' );
            return;
        }
        else if ( !interaction.member.voice.channelId )
        {
            interaction.editReply( '같은 음성채널에서만 상호작용 가능합니다' );
            return;
        }
        else if ( getVoiceConnection( interaction.guildId ).joinConfig.channelId !== interaction.member.voice.channelId )
        {
            interaction.editReply( '같은 음성채널에서만 상호작용 가능합니다' );
            return;
        }

        audio.once( 'add', ( length ) =>
        {
            if ( length > 1 )
            {
                interaction.editReply( `${url}\n${length} songs added to the queue` );
            }
            else
            {
                const embed = new Embed( ).songAdd( audio.playlist.at( -1 ) );

                interaction.editReply( { content : '▼ Added successfully!', embeds : [ embed ] } );
            }
        } );

        audio.on( 'error', ( error ) =>
        {
            console.error( `Error: ${error.message}` );
            
            if ( error.code == 'invalidurl' )
            {
                interaction.editReply( { content: 'This URL is unknown', ephemeral : true } );
            }
            else if ( error.code == 'unknownvideo' )
            {
                interaction.editReply( { content: 'Unknown video', ephemeral : true } );
            }
            else if ( error.code == 'unknownplaylist' )
            {
                interaction.editReply( { content: 'Unknown playlist', ephemeral : true } );
            }
            else if ( error.code == 'longplaylist' )
            {
                interaction.editReply( { content: 'Playlists of more than 75 songs cannot be added to the queue', ephemeral : true } );
            }
            else if ( error.code == 'errorplaylist' )
            {
                interaction.editReply( { content : `재생목록에 재생할 수 없는 영상이 있습니다`, ephemeral : true } );
            }
            else
            {
                interaction.editReply( { content : `Error 404\nError: ${error.message}`, ephemeral : true } );
            }
        } );

        if ( ytpl.validateID( url ) || ytdl.validateURL( url ) )
        {
            audio.add( url );
        }
        else
        {
            await youtube.search( url, 1, function ( err, result )
            {
                if ( err )
                {
                    console.log( err );
                    interaction.editReply( `Error 404` );
                    return;
                }
                const link = "https://www.youtube.com/watch?v=" + result[ "items" ][ 0 ]["id"]["videoId"];

                audio.add( link );
            } );
        }
    }
};