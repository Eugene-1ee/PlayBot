const { Events, EmbedBuilder } = require( 'discord.js' );

module.exports =
{
    name : Events.InteractionCreate,
    async execute( interaction )
    {
        if ( !interaction.isChatInputCommand( ) )
        {
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
            console.log( `#${interaction.channel.name} <@${interaction.user.username}> [${interaction.commandName}]` );
            await command.execute( interaction );
        }
        catch ( error )
        {
            console.error( `${ interaction.commandName }을 실행하는 도중 오류가 발생했습니다.` );
            console.error( error );

            const Embed = new EmbedBuilder( )
                // .setColor( '#0x7d3640' )
                .setTitle( '에러 발생!' );

            return interaction.reply( { embeds: [ Embed ], ephemeral : true } );
        }
    }
}