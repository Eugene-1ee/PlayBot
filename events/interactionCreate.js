const { Events } = require( 'discord.js' );
const fs = require( 'node:fs' );

module.exports =
{
    name : Events.InteractionCreate,
    async execute( interaction )
    {
        if ( !interaction.isChatInputCommand( ) )
        {
            return;
        }

        const blacklist = JSON.parse( fs.readFileSync( 'assets/blacklist.json' ) );

        if ( blacklist.indexOf( interaction.user.id ) != -1 )
        {
            interaction.reply( { content : '너 정지됨\n관리자한테 문의 ㄱ', ephemeral : true } );
            return;
        }

        const command = interaction.client.commands.get( interaction.commandName );

        if ( !command )
        {
            console.error( `${ interaction.commandName }에 해당하는 명령이 발견되지 않았습니다.` );
            return;
        }

        try
        {
            console.log( `#${interaction.channel.name} <${interaction.user.tag}> [${interaction.commandName}]` );
            await command.execute( interaction );
        }
        catch ( error )
        {
            console.error( `${ interaction.commandName }을 실행하는 도중 오류가 발생했습니다.` );
            console.error( error );
        }
    }
}