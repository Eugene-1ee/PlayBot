const fs = require( 'fs' );
const { EmbedBuilder } = require( 'discord.js' );

/** HighLow 게임 임베드 함수 */
function hlEmbed( message, point, combo )
{
    const Url = `assets/temp/${ message.author.id }.json`;
    const parsedData = JSON.parse( fs.readFileSync( Url ) );

    const array = JSON.parse( fs.readFileSync( Url ) )[ "배열" ];
    array[ parsedData[ "현재" ] ] = ':⚫:';

    let msg;
    const Embed = new EmbedBuilder();
    
    if ( point == -2 )
    {
        msg = '잘 해봐! 응원은 해줄게!';
        Embed.setColor( '#7e9091' )
    }
    else if ( point == 0 && combo == -1 )
    {
        msg = '스킵했네? 쫄? 쫄???';
        Embed.setColor( '#424141' )
    }
    else if ( point == 0 && combo == -2 )
    {
        msg = '같은 숫자였지만 뭐 어때!';
        Embed.setColor( '#9aa1c9' )
    }
    else if ( point == 0 )
    {
        msg = '아앗 저런... 까비요..';
        Embed.setColor( '#ff0000' )
    }
    else if ( point == 2 )
    {
        msg = '순조롭구만?';
        Embed.setColor( '#00ffec' )
    }
    else if ( point == 6 )
    {
        msg = '헐 어케했어 6점 드림!';
        Embed.setColor( '#00e926' )
    }
    else
    {
        msg = '이게 보인다면 말도 안되는 버그임';
        Embed.setColor( '#ff0000' )
    }

    const text = ( `다음 패의 숫자가 현재 패보다 높을까 낮을까? 골라보시라!\n${ msg }\n\n` 
                +`${ array.slice( 0, 9 ) }\n`
                +`${ array.slice( 9, 18 ) }\n`
                +`${ array.slice( 18, 27 ) }\n`
                +`${ array.slice( 27, 36 ) }` ).replace( /,/gi, ' ' );

    Embed.setTitle( '게임' )
    .setDescription( `${ text }` )
    .addFields(
        { name : '현재 패', value : `${ parsedData[ "배열" ][ parsedData[ "현재" ] ] }`, inline: true },
        { name : '다음 패', value : `${ parsedData[ "배열" ][ parsedData[ "다음" ] ].slice( 0, -1 ) }?`, inline: true },
        { name : '체력', value : `${ ( '♥'.repeat( parsedData[ "체력" ] ) + '♡♡' ).slice( 0, 3 ) }`, inline: true },
        { name : '점수', value : `${ parsedData[ "점수" ] }`, inline: true },
        { name : '콤보', value : `x${ parsedData[ "콤보" ] }`, inline: true } )
    .setTimestamp()
    .setFooter( { text : `승리 조건: 50점 이상` } );

    return Embed;
};

module.exports = hlEmbed;