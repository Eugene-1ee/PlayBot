const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection, joinVoiceChannel } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );
const Embed = require( '../modules/embed' );
const ytpl = require( 'ytpl' );
const ytdl = require( 'ytdl-core' );
const YouTube = require( 'youtube-node' );
const { youtubeApiKey } = require( '../config.json' );
const youtube = new YouTube();
youtube.setKey( youtubeApiKey );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'play' )
        .setDescription( 'Play the music' )
        .addStringOption( option => option
            .setName( 'search' )
            .setDescription( 'Please enter a song Name/Url' ) ),
            
    async execute( interaction )
    {
        await interaction.deferReply( );

        const url = interaction.options.getString( 'search' );
        const audio = new Audio( interaction.guildId );

        let connection = getVoiceConnection( interaction.guildId );
        if ( !connection )
        {
            if ( interaction.member.voice.channelId )
            {
                connection = joinVoiceChannel(
                {
                    channelId : interaction.member.voice.channelId,
                    guildId : interaction.guildId,
                    adapterCreator : interaction.guild.voiceAdapterCreator
                } );
                connection.subscribe( audio.player );
            }
            else
            {
                await interaction.editReply( { content: 'Please go into the voice channel first!', ephemeral : true } );
                return;
            }
        }
        else if ( !interaction.member.voice.channelId )
        {
            interaction.editReply( 'Interactive only on the same voice channel' );
            return;
        }
        else if ( getVoiceConnection( interaction.guildId ).joinConfig.channelId !== interaction.member.voice.channelId )
        {
            interaction.editReply( 'Interactive only on the same voice channel' );
            return;
        }
        
        audio.once( 'play', ( ) =>
        {
            const embed = new Embed( ).songPlay( audio.playlist[ 0 ] );

            interaction.editReply( { embeds : [ embed ] } );

            return;
        } );

        audio.once( 'add', ( length ) =>
        {
            if ( length > 1 )
            {
                interaction.editReply( `${length} songs added to the queue` );
            }
            else
            {
                const embed = new Embed( ).songAdd( audio.playlist.at( -1 ) );

                interaction.editReply( { content : '▼ Added successfully!', embeds : [ embed ] } );
            }
        } );

        audio.once( 'error', ( error ) =>
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
            else if ( error.code == 'noplaylist' )
            {
                interaction.editReply( { content: 'The playlist is empty', ephemeral : true } );
            }
            else if ( error.code == 'longplaylist' )
            {
                interaction.editReply( { content: 'Playlists of more than 50 songs cannot be added to the queue!', ephemeral : true } );
            }
            else
            {
                interaction.editReply( { content: `Error 404\nError: ${ error.message }`, ephemeral : true } );
            }

            return;
        } );

        if ( !audio.status.playing )
        {
            if ( !url || ytpl.validateID( url ) || ytdl.validateURL( url ) )
            {
                audio.play( url );
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

                    audio.play( link );
                } );
            }
        }
        else
        {
            if ( !url )
            {
                interaction.editReply( `Already playing...` );
            }
            else if ( ytpl.validateID( url ) || ytdl.validateURL( url ) )
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
    }
};