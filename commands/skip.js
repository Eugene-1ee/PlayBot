const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );
const Embed = require( '../modules/embed' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'skip' )
        .setDescription( 'Play the next song in queue' ),
        
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

        if ( !audio.playlist[ 1 ] )
        {
            interaction.editReply( "✅\nAll songs in the queue have been played" );
            audio.reset( );

            return;
        }

        audio.once( 'play', ( ) =>
        {
            const embed = new Embed( ).songPlay( audio.playlist.at( 0 ) );

            interaction.editReply( { content : '✅', embeds : [ embed ] } );

            return;
        } );

        audio.skip( );
    }
};
