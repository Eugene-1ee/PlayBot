const { Events, ActivityType } = require( 'discord.js' );
const reset = require( '../modules/reset' );

module.exports =
{
    name : Events.ClientReady,
    once : true,

    execute( client )
    {
        reset();

        client.user.setActivity({ name: 'Piano', type: ActivityType.Playing });

        console.log( `${client.user.tag} Excute.` );
    },
};