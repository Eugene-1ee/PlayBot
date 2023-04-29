const youtube = require( "../util/youtube.js" );

const { erremb } = require( "../util/embed.js" );

const { skiper } = require( "../functions/skiper.js" );

let { connection, player, playlist, resource, volume, station } = require( "../functions/val.js" );

function stat_handler( interaction, guildId )
{
    if ( station[ guildId ] === "on" )
    {
        station[ guildId ] = [ playlist[ guildId ][ 0 ].id ];
    }
    else
    {
        station[ guildId ][ station[ guildId ].length ] = playlist[ guildId ][ 0 ].id;
    }

    youtube.relatedVideo( playlist[ guildId ][ 0 ].id, async ( rel_video ) =>
    {
        if ( !rel_video )
        {
            return skiper( interaction, 0, () =>
            {
                return handler( interaction, interaction.guild.id );
            } );
        }

        for ( let unter in rel_video )
        {
            if ( !station[ guildId ].find( element => element === rel_video[ unter ].id ) )
            {
                const { adder } = require( "../functions/adder.js" );

                await adder( interaction, rel_video[ unter ].title, rel_video[ unter ].id, rel_video[ unter ].length, rel_video[ unter ].user, true );
                return skiper( interaction, 0, ( ) => { } );
            }
        }
    } );
};

module.exports =
{
    stat_handler: stat_handler
};