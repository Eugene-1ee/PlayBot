const { EmbedBuilder } = require( 'discord.js' );
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection } = require( '@discordjs/voice' );
const ytdl = require( 'ytdl-core' );

const timeConvert = require( '../util/timeConvert.js' );
const { erremb } = require( '../util/embed.js' );
const { cleanup } = require( '../functions/cleanup.js' );
const { skiper } = require( '../functions/skiper.js' );
const { stat_handler } = require( '../functions/stat_handler.js' );

let { connection, player, playlist, resource, volume, station } = require( '../functions/val.js' );

require( 'dotenv' ).config( );

async function play( interaction, title, id, length, user )
{
    let url = 'https://youtu.be/' + id;

    player[ interaction.guild.id ] = createAudioPlayer( );
    connection[ interaction.guild.id ].subscribe( player[ interaction.guild.id ] );

    if ( !volume[ interaction.guild.id] )
    {
        volume[ interaction.guild.id ] = 1;
    }

    if ( getVoiceConnection( interaction.guild.id )._state.status !== 'ready' || !connection[ interaction.guild.id ] )
    {
        return cleanup( interaction.guild.id );
    }

    resource[ interaction.guild.id ] = createAudioResource( ytdl( url, { filter : 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 } ), { inlineVolume: true } );
 
    resource[ interaction.guild.id ].volume.setVolume( volume[ interaction.guild.id ] );

    player[ interaction.guild.id ].play( resource[ interaction.guild.id ] );

    player[ interaction.guild.id ].once( AudioPlayerStatus.Idle, async ( ) =>
    {
        if ( station[interaction.guild.id] === 'repeat' )
        {
            const { adder } = require( '../functions/adder.js' );

            await adder( interaction, title, id, length, user, true );
            return skiper( interaction, 0, ( ) => { } );
        }

        if ( !playlist[ interaction.guild.id ][ 1 ] && station[ interaction.guild.id ] )
        {
            return stat_handler( interaction, interaction.guild.id );
        }
            
        return skiper( interaction, 0, ( ) => { } );
    } );

    if ( station[ interaction.guild.id ] === 'repeat' )
    {
        return;
    }
    
    let playemb = new EmbedBuilder( )
    // .setColor('#0x7d3640')
        .setThumbnail( 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg' )
        .setDescription( `[${title}](https://www.youtube.com/watch?v=${id}) \`\`${timeConvert(length)}\`\`` )
        .setFooter( { text: `Added by ${user.username}#${user.discriminator}` } );;

    if ( !station[ interaction.guild.id ] )
    {
        playemb.setTitle( ':notes: Now Playing' );
    }
    else
    {
        playemb.setTitle( ':fire: Now Playing' );
    }

    return interaction.channel.send( { embeds: [ playemb ] } );
};

module.exports =
{
    play: play
};