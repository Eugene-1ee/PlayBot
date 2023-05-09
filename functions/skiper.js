const { EmbedBuilder } = require( 'discord.js' );

const { cleanup } = require( '../functions/cleanup.js' );

let { connection, player, playlist, resource, station } = require( '../functions/val.js' );

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
        const embed = new EmbedBuilder( )
        .setTitle( `모든 음악의 재생이 끝났습니다` )
        .setDescription( '언제든 불러주세요!' )
        .setColor( '#535353' );;
    
        interaction.channel.send( { embeds: [ embed ] } );
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