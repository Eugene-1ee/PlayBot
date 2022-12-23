const { SlashCommandBuilder } = require( 'discord.js' );
const Audio = require( '../modules/audio' );
const Embed = require( '../modules/embed' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'queue' )
        .setDescription( 'List of the queue' ),
        
    async execute( interaction )
    {
        await interaction.deferReply( );

        const audio = new Audio( interaction.guildId );

        const time = parseInt( audio.player._state.playbackDuration / 1000 );

        if ( audio.playlist[ 0 ] )
        {
            const embed = new Embed( ).playlist( audio.playlist, time );

            await interaction.editReply( { embeds : [ embed ] } );
        }
        else
        {
            await interaction.editReply( 'Queue is empty' );
        }
    }
};
