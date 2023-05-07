const { play } = require( '../../functions/play.js' );
let { connection, player, playlist, resource, volume, station } = require( '../../functions/val.js' );

module.exports =
{
    name : 'uncaughtException',
    async execute( error )
    {
        console.log( 'Uncaught Promise Exception:', error.message );

        if ( error.message == 'Status code: 403' )
        {
            console.log( '노래 로딩 재시도 프로세스 실행' );

            const interaction = error.resource.interaction;

            await interaction.channel.send( "재생 오류 발생\n재시도합니다" );

            await play(
                interaction,
                playlist[ interaction.guild.id ][0].title,
                playlist[ interaction.guild.id ][0].id,
                playlist[ interaction.guild.id ][0].length,
                playlist[ interaction.guild.id ][0].user,
                );
            return;
        }
        else
        {
            return;
        }
    }
}