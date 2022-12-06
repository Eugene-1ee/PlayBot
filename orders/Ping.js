const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data : [ '핑', 'ping' ],
	async execute( message, client )
	{
        const timeTaken = Date.now() - message.createdTimestamp;

        const Embed = new MessageEmbed()
        .setColor( '#4432a8' )
        .setTitle( '핑!' )
        .setDescription( `${timeTaken}ms`)
        
        await message.reply( { embeds: [Embed] } );
    }
}