const { SlashCommandBuilder, EmbedBuilder } = require( 'discord.js' );

module.exports =
{
    data : new SlashCommandBuilder( )
        .setName( '핑' )
        .setDescription( '딜레이를 확인합니다' ),
        
    async execute( interaction )
    {
        const timeTaken = Date.now( ) - interaction.createdTimestamp;

        const Embed = new EmbedBuilder( )
        .setColor( '#383838' )
        .setTitle( '핑!' )
        .setDescription( `${timeTaken}ms`);
        
        await interaction.reply( { embeds: [ Embed ] } );
        return;
    }
};
