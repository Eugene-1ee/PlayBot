const { EmbedBuilder } = require( 'discord.js' );

module.exports = {
	data : [ '핑' ],
	async execute( message )
	{
        const timeTaken = Date.now() - message.createdTimestamp;

        const Embed = new EmbedBuilder()
        .setColor( '#4432a8' )
        .setTitle( '핑!' )
        .setDescription( `${timeTaken}ms` );
        
        await message.reply( { embeds: [ Embed ] } );
    }
};