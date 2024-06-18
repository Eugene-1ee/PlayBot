const { EmbedBuilder, SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

/**
 * 재생 확인
 * @param {} interaction
 * @returns 재생중이면 false, 아니면 true
 */
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

/**
 * 연결 확인
 * @param {} interaction
 * @returns 연결되어있다면 false, 아니면 true
 */
function connectcheck( interaction )
{
    let check = false;

    if ( !connection[ interaction.guild.id ] || getVoiceConnection( interaction.guild.id )._state.status !== 'ready' )
    {
        check = true;
    }

    return check;
};

/**
 * 음악 존재 여부 확인
 * @param {} interaction
 * @returns 노래 존재시 false, 아니면 true
 */
function musiccheck( interaction )
{
    let check = false;
    
    if ( !playlist[ interaction.guild.id ] )
    {
        check = true;
    }

    return check;
};

/**
 * 유저 확인
 * @param {} interaction
 * @returns 사용 가능 시 true, 아니면 false
 */
function usercheck( interaction )
{
    let check;

    if ( !interaction.member.voice?.channelId )
    {
        check = new EmbedBuilder( )
            .setTitle( '통화방에 먼저 접속해주세요!' )
            .setDescription( '음악이 채팅으로 나올거라 생각했나요?' );
    }
    else if ( getVoiceConnection( interaction.guildId ) )
    {
        if ( getVoiceConnection( interaction.guild.id ).joinConfig.channelId
            !== interaction.member.voice.channelId )
        {
            check = new EmbedBuilder( )
                .setTitle( '봇과 같은 통화방에 접속해주세요!' )
                .setDescription( '악용을 막기위해서...' );
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