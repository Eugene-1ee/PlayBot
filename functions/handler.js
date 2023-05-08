const { cleanup } = require( '../functions/cleanup.js' );
const { play } = require( '../functions/play.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

/**
 * 재생 중간 관리자
 * @param {} interaction
 * @param { string } guildId interaction.guild.id
 */
function handler( interaction, guildId )
{
    if ( !playlist[ guildId ] )
    {
        return cleanup( guildId );
    }

    let song = playlist[ guildId ][ 0 ];

    return play( interaction, song.title, song.id, song.length, song.author, song.user, true );
};

module.exports =
{
    handler: handler
};