module.exports =
{
    name : 'ready',
    once : true,
    execute( client )
    {
        client.user.setActivity( '피아노 연주' , { type : 'LISTENING' } );
        console.log( `${client.user.tag} Excute.` );
    }
};