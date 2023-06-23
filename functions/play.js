const { EmbedBuilder } = require( 'discord.js' );
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require( '@discordjs/voice' );
const ytdl = require( 'ytdl-core' );

const timeConvert = require( '../util/timeConvert.js' );
const { erremb } = require( '../util/embed.js' );
const { cleanup } = require( '../functions/cleanup.js' );
const { skiper } = require( '../functions/skiper.js' );
const { stat_handler } = require( '../functions/stat_handler.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

require( 'dotenv' ).config( );

/**
 * 재생 관리자
 * @param {} interaction
 * @param { string } title 노래 제목
 * @param { string } id 노래 id
 * @param { string } length 노래 길이
 * @param {} author 노래 채널
 * @param {} user interaction.user
 * @param { Boolean } next true면 메시지 띄움
 */
async function play( interaction, title, id, length, author, user, next )
{
    let url = 'https://youtu.be/' + id;

    player[ interaction.guild.id ] = createAudioPlayer( );
    
    connection[ interaction.guild.id ].subscribe( player[ interaction.guild.id ] );

    if ( getVoiceConnection( interaction.guild.id )._state.status !== 'ready' || !connection[ interaction.guild.id ] )
    {
        cleanup( interaction.guild.id );
        return;
    }

    resource[ interaction.guild.id ] = createAudioResource( ytdl( url, { filter : 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 } ), { inlineVolume: false } );

    resource[ interaction.guild.id ][ 'interaction' ] = interaction;

    player[ interaction.guild.id ].play( resource[ interaction.guild.id ] );

    // 에러 발생했을때 대처방법 생각하기
    player[ interaction.guild.id ].once( AudioPlayerStatus.Idle, async ( ) =>
    {
        if ( station[ interaction.guild.id ] === 'repeat' )
        {
            const { adder } = require( '../functions/adder.js' );

            await adder( interaction, title, id, length, author, user, true );
            return skiper( interaction, 0, ( ) => { } );
        }

        if ( !playlist[ interaction.guild.id ][ 1 ] && station[ interaction.guild.id ] )
        {
            return stat_handler( interaction, interaction.guild.id );
        }

        return skiper( interaction, 0, ( ) => { } );
    } );

    if ( station[ interaction.guild.id ] === 'repeat' || !next )
    {
        return;
    }
    
    const playemb = new EmbedBuilder( )
        .setColor( '#EAEAEA' )
        .setThumbnail( 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg' )
        .setDescription( `[${title}](https://www.youtube.com/watch?v=${id}) \`\`${timeConvert(length)}\`\`` )
        .setFooter( { text: `Added by @${user.username}`, iconURL: user.displayAvatarURL( ) } );

    if ( !station[ interaction.guild.id ] )
    {
        playemb.setTitle( ':notes: Now Playing' );
    }
    else
    {
        playemb.setTitle( ':fire: Now Playing' );
    }

    interaction.channel.send( { embeds: [ playemb ] } )
    return;
};

module.exports =
{
    play: play
};