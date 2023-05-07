module.exports =
{
    name : 'uncaughtExceptionMonitor',
    async execute( error )
    {
        console.log( 'Uncaught Promise Exception (Monitor):', error.message );

        if ( error.message == 'aborted' )
        {
            console.log( '긴 영상 재생 끊김.' );

            const interaction = error.resource.interaction;

            interaction.channel.send( "너무 긴 영상을 재생했나봐\n오류 발생!" );
            return;
        }
        else
        {
            return;
        }
    }
}