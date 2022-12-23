const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );
const fs = require( 'fs' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'leave' )
        .setDescription( 'Leave the voice channel' ),
        
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

        const connection = getVoiceConnection( interaction.guildId );

        if ( connection )
        {
            connection.destroy( );
        }
        else
        {
            await interaction.editReply( { content : 'The bot is not inside the voice channel', ephemeral : true } );
            return;
        }

        const Checked = fs.existsSync( `temp/${ interaction.guildId }.ogg` );
        if ( Checked )
        {
            fs.unlink( `temp/${ interaction.guildId }.ogg`, err => {
                if ( err )
                {
                    throw err;
                }
              
                console.log( `(Music)${ interaction.guildId }.ogg is deleted.` );
            } );
        }

        const audio = new Audio( interaction.guildId );
        audio.reset( );

        await interaction.editReply( `Bang!` );
    }
};