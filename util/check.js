const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

let { connection, player, playlist, resource, volume, station } = require( '../functions/val.js' );

function songcheck( interaction )
{
    let check = false;

    if ( ( !connection[ interaction.guild.id ]
        || getVoiceConnection( interaction.guild.id )._state.status !== 'ready' )
        && !playlist[ interaction.guild.id ] )
    {
        check = true;
    }

    return check;
}

function connectcheck( interaction )
{
    let check = false;

    if ( !connection[ interaction.guild.id ] || getVoiceConnection( interaction.guild.id )._state.status !== 'ready' )
    {
        check = true;
    }

    return check;
};

function musiccheck( interaction )
{
    let check = false;
    
    if ( !playlist[ interaction.guild.id ] )
    {
        check = true;
    }

    return check;
};

function usercheck( interaction )
{
    let check = false;

    if ( interaction.member.voice?.channelId )
    {
        if ( getVoiceConnection( interaction.guildId ) )
        {
            if ( getVoiceConnection( interaction.guild.id ).joinConfig.channelId
                == interaction.member.voice.channelId )
            {
                check = true;
            }
        }
        else
        {
            check = true;
        }
    }

    return check;
}

module.exports =
{
    songcheck: songcheck,
    connectcheck: connectcheck,
    musiccheck: musiccheck,
    usercheck: usercheck
};