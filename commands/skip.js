const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );
const Embed = require( '../modules/embed' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'skip' )
        .setDescription( '대기열의 다음 노래를 재생합니다' ),
        
    async execute( interaction )
    {
        await interaction.deferReply( );

        if ( !getVoiceConnection( interaction.guildId ) )
        {
            interaction.editReply( 'Bot is not connecting to voice channel' );
            return;
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

        const audio = new Audio( interaction.guildId );

        audio.once( 'play', ( ) =>
        {
            const embed = new Embed( ).songPlay( audio.playlist.at( 0 ) );

            interaction.editReply( { content : '✅ Skip success!', embeds : [ embed ] } );

            return;
        } );

        if ( !audio.playlist[ 1 ] )
        {
            interaction.editReply( "✅\nAll songs in the queue have been played" );
            audio.reset( );

            return;
        }
        else
        {
            audio.skip( );
        }
    }
};
