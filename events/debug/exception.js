const { play } = require( '../../functions/play.js' );
let { connection, player, playlist, resource, station } = require( '../../functions/val.js' );

module.exports =
{
    name : 'uncaughtException',
    async execute( error )
    {
        console.log( 'Uncaught Promise Exception:', error.message );

        if ( error.message == 'aborted' )
        {
            console.log( '긴 영상 재생 끊김.' );

            const interaction = error.resource.interaction;

            interaction.channel.send( "너무 긴 영상을 재생했나봐\n오류 발생!" );

            return;
        }
        // else if ( error.message == 'Status code: 403' )
        // {
            console.log( '노래 로딩 재시도 프로세스 실행' );

            const interaction = error.resource.interaction;

            await play(
                interaction,
                playlist[ interaction.guild.id ][0].title,
                playlist[ interaction.guild.id ][0].id,
                playlist[ interaction.guild.id ][0].length,
                playlist[ interaction.guild.id ][0].author,
                playlist[ interaction.guild.id ][0].user,
                false
                );
                
            return;
        // }
        // else
        // {
        //     console.log( error );
        //     return;
        // }
    }
}