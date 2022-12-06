const { SlashCommandBuilder } = require( '@discordjs/builders' );
const wait = require( 'util' ).promisify( setTimeout );
const Discord = require( 'discord.js' );

module.exports = {
	data : new SlashCommandBuilder()
		.setName( 'ping' )
		.setDescription( '딜레이를 알려줍니다' ),
    
    async execute( interaction, client )
    {
        const timeTaken = Date.now() - interaction.createdTimestamp;

        const Embed = new Discord.MessageEmbed()
        .setColor( '#4432a8' )
        .setTitle( '핑!' )
        .setDescription( `${timeTaken}ms`)
        
        await interaction.reply( { embeds: [Embed] } );
    }
};