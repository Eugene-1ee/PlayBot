const { SlashCommandBuilder } = require( 'discord.js' );
const fs = require( 'fs' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'download' )
        .setDescription( "Download the song that's playing right now" ),

    async execute( interaction )
    {
        await interaction.deferReply( );

        const Checked = fs.existsSync( `temp/${interaction.guildId}.ogg` );
        if ( Checked )
        {
            interaction.editReply( { content: `When you download music, it's better to pause the music\nThere are people who listen to music, right?`, files: [ { attachment: `temp/${interaction.guildId}.ogg`, name: 'music.mp3' } ] } );
        }
        else
        {
            interaction.editReply( 'There is no music playing' );
        }
    }
}