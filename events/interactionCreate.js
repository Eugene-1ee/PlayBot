module.exports =
{
    name : 'interactionCreate',
    execute( interaction )
    {
        console.log( `(#${interaction.channel.name})에서 (${interaction.user.tag})가 (${interaction.commandName})명령어를 실행했습니다.` );
    }
};