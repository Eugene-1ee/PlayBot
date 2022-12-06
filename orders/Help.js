const { MessageEmbed } = require( "discord.js" );

module.exports = {
	data : [ '도움말', 'help' ],
	async execute( message, client )
	{
        await message.reply( '심심이에게 물어보쇼\n내가 최근에 업데이트해서 반영은 안되어있지만ㅋㅋㅋㅋ' );
    }
}