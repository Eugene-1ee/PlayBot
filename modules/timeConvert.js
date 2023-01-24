/**
 * 시간의 단위를 나눠주는(초->시간분초) 함수
 * @param { number } seconds x초
 * @returns x시간 x분 x초
 */
function timeToKo( seconds )
{
    const hour = parseInt( seconds / 3600 ) == 0 ?
        '' : `${ parseInt( seconds / 3600 ) }시간 ` ;

    const min = parseInt( ( seconds % 3600 ) / 60 ) == 0 ?
        '' : `${ parseInt( ( seconds % 3600 ) / 60 ) }분 `;
        
    const sec = seconds % 60 == 0 ?
        '' : `${ seconds % 60 }초`;
    
    const time = hour + min + sec;
    return time;
};

module.exports = timeToKo;