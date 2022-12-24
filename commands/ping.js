const { SlashCommandBuilder, EmbedBuilder } = require( 'discord.js' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( 'ping' )
        .setDescription( '딜레이를 확인합니다' ),
        
    async execute( interaction )
    {
        const timeTaken = Date.now() - interaction.createdTimestamp;

        const Embed = new EmbedBuilder()
        .setColor( '#4432a8' )
        .setTitle( 'Pong!' )
        .setDescription( `${timeTaken}ms`);
        
        await interaction.reply( { embeds: [ Embed ] } );
    }
};
