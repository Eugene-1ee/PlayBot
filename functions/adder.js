const { EmbedBuilder } = require( 'discord.js' );
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } = require( '@discordjs/voice' );

const { cleanup } = require( '../functions/cleanup.js' );
const { handler } = require( '../functions/handler.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

/**
 * 플레이리스트 관리자
 * @param {} interaction
 * @param { string } title 노래 제목
 * @param { string } id 노래 id
 * @param { string } length 노래 길이
 * @param {} author 노래 채널
 * @param { boolean } isList 플레이리스트여부
 */
async function adder( interaction, title, id, length, author, isList )
{
    if ( !connection[ interaction.guild.id ] || await getVoiceConnection( interaction.guild.id )?.state?.status == 'disconnected' )
    {
        cleanup( interaction.guild.id );
        connection[ interaction.guild.id ] = joinVoiceChannel(
        {
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
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
    song[ 'author' ] = author;
    song[ 'user' ] = interaction.user;

    playlist[ interaction.guild.id ][ temp_index ] = song;

    //Add Song

    if ( resource[ interaction.guild.id ] )
    {
        if ( isList )
        {
            return;
        }
        
        if ( !station[ interaction.guild.id ] )
        {
            const adderemb = new EmbedBuilder( )
                .setColor('#737373')
                .setTitle( '재생목록에 추가했습니다!' )
                .setDescription( `[${title}](https://www.youtube.com/watch?v=${id})` )
                .setThumbnail( 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg' )
                .setFooter( { text: author.name, iconURL: author.thumbnails.at( -1 ).url } );
            
            return interaction.channel.send( { embeds: [ adderemb ] } );
        }
        else
        {
            return;
        }
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