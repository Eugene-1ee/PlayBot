const { cleanup } = require( "../functions/cleanup.js" );
const { play } = require( "../functions/play.js" );

let { connection, player, playlist, resource, volume, station } = require( "../functions/val.js" );

function handler( interaction, guildId )
{
    if ( !playlist[ guildId ] )
    {
        return cleanup( guildId );
    }

    let song = playlist[ guildId ][ 0 ];

    return play( interaction, song.title, song.id, song.length, song.user );
};

module.exports =
{
    handler: handler
};