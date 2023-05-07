const { cleanup } = require( '../functions/cleanup.js' );

let { connection, player, playlist, resource, volume, station } = require( '../functions/val.js' );

/**
 * 스킵 관리자
 * @param {} interaction
 * @param { string } track 트랙 번호
 */
function skiper( interaction, track, callback )
{
    delete playlist[ interaction.guild.id ][ track ];
            
    let temp_plist = playlist[ interaction.guild.id ];
    playlist[ interaction.guild.id ] = new Map( );

    let counter = 0;

    for ( let unter in temp_plist )
    {
        playlist[ interaction.guild.id ][ counter ] = temp_plist[ unter ];
        counter++;
    }

    if ( !playlist[ interaction.guild.id ][ 0 ] )
    {
        interaction.channel.send( '모든 음악이 재생되었습니다.' );
        cleanup( interaction.guild.id );
        return callback( true );
    }

    if ( track == 0 )
    {
        player[ interaction.guild.id ].stop( );

        //?
        const { handler } = require( '../functions/handler.js' );
        
        handler( interaction, interaction.guild.id );
    }

    return callback( true );
};

module.exports =
{
    skiper: skiper
};