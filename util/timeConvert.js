/**
 * Change the second to hour:minute:second
 * @param { number } seconds
 * @returns x:xx:xx
 */
 function timeConvert( seconds )
 {
    if ( !seconds )
    {
        return '[Roading]';
    }
    const hour = parseInt( seconds / 3600 ) == 0 ?
         '' : `${ parseInt( seconds / 3600 ) }:` ;
    const min = parseInt( ( seconds % 3600 ) / 60 ) == 0 ?
        ( hour == ''? '0:': '00:' ) : ( parseInt( ( seconds % 3600 ) / 60 ) < 10 && hour !== '' ? `0${ parseInt( ( seconds % 3600 ) / 60 ) }:` : `${ parseInt( ( seconds % 3600 ) / 60 ) }:` );
    const sec = seconds % 60 == 0 ?
        '00' : ( seconds % 60 < 10 ? `0${ seconds % 60 }` : `${ seconds % 60 }` );
     
    const time = hour + min + sec;
    return time;
 };
 
 module.exports = timeConvert;