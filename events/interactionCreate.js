const { Events } = require( 'discord.js' );

module.exports =
{
    name : Events.InteractionCreate,
    async execute( interaction )
    {
        console.log( `#${interaction.channel.name} [${interaction.user.tag}] {${interaction.commandName}}` );

        if ( !interaction.isChatInputCommand( ) )
        {
            return;
        }

        const command = interaction.client.commands.get( interaction.commandName );

        try
        {
            await command.execute( interaction );
        }
        catch ( error )
        {
            console.error( `${interaction.commandName}을 실행하는 도중 오류가 발생했습니다.` );
            console.error( error );
        }
    }
}