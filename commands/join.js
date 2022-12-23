const { SlashCommandBuilder } = require( 'discord.js' );
const { getVoiceConnection, joinVoiceChannel } = require( '@discordjs/voice' );
const Audio = require( '../modules/audio' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'join' )
        .setDescription( 'Connect to the voice channel' ),
        
    async execute( interaction )
    {
        await interaction.deferReply( );
        
        if ( getVoiceConnection( interaction.guildId ) )
        {
            interaction.editReply( 'The bot is already a voice channel' );
            return;
        }
        else if ( interaction.member.voice.channelId )
        {
            await interaction.editReply( `#${ interaction.member.voice.channel.name }\nConnect the voice channel` );

            const connection = joinVoiceChannel(
            {
                channelId : interaction.member.voice.channelId,
                guildId : interaction.guildId,
                adapterCreator : interaction.guild.voiceAdapterCreator
            } );

            const audio = new Audio( interaction.guildId );
            connection.subscribe( audio.player );
        }
        else
        {
            await interaction.editReply( { content: 'Please go into the voice channel!', ephemeral : true } );
        }
    }
};