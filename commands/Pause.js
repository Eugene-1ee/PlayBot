const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'pause' )
        .setDescription( '노래를 일시정지합니다' ),
        
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

        audio.once( 'pause', ( ) =>
        {
            interaction.editReply( 'The music has been paused' );
        } );

        audio.once( 'cannotpause', ( ) =>
        {
            interaction.editReply( { content : 'The music has already been paused', ephemeral : true } );
        } );

        audio.pause( );
    }
};