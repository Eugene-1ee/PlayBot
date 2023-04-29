const { EmbedBuilder } = require( 'discord.js' );
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require( '@discordjs/voice' );

const { erremb } = require( '../util/embed.js' );
const { cleanup } = require( '../functions/cleanup.js' );
const { handler } = require( '../functions/handler.js' );

let { connection, player, playlist, resource, volume, station } = require( '../functions/val.js' );

async function adder( interaction, title, id, length, isList )
{
    //Connection
    if ( !isList )
    {
        console.log( 'Channel:' + getVoiceConnection( interaction.guild.id ) );
    }

    if ( !connection[ interaction.guild.id ]
        || await getVoiceConnection( interaction.guild.id )._state.status !== 'ready'
        && await getVoiceConnection( interaction.guild.id )._state.status !== 'signalling' )
    {
        cleanup( interaction.guild.id );
        connection[ interaction.guild.id ] = joinVoiceChannel(
        {
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        } );
    }
    //Connection

    //Add Song
    let temp_index = '';

    if ( !playlist[ interaction.guild.id ] )
    {
        playlist[ interaction.guild.id ] = new Map( );
        temp_index = 0;
    }
    else
    {
        temp_index = Object.keys( playlist[ interaction.guild.id ] ).length;
    }

    let song = new Map();
    song[ 'title' ] = title;
    song[ 'id' ] = id;
    song[ 'length' ] = length;

    playlist[ interaction.guild.id ][ temp_index ] = song;
    playlist[ interaction.guild.id ][ temp_index ][ 'user' ] = interaction.user;
    //Add Song

    if ( resource[ interaction.guild.id ] )
    {
        if ( isList )
        {
            return;
        }

        const adderemb = new EmbedBuilder( )
        // .setColor('#0x7d3640')
            .setTitle( ':white_check_mark:  **|**  재생목록에 추가했습니다!' )
            .setDescription( title )
            .setThumbnail( 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg' );
        
        return interaction.channel.send( { embeds: [ adderemb ] } );
    }
    else
    {
        resource[ interaction.guild.id ] = true;
        connection[ interaction.guild.id ].once( VoiceConnectionStatus.Ready, ( ) =>
        {
            return handler( interaction, interaction.guild.id );
        });
    }
};

module.exports =
{
    adder: adder
};