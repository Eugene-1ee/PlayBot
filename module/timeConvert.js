/**
 * 시간의 단위를 나눠주는(초->시간분초) 함수
 * @param { number } seconds x초
 * @returns x시간 x분 x초
 */
 function timeUnit( seconds )
 {
     const hour = parseInt( seconds / 3600 ) == 0 ?
         '' : `${ parseInt( seconds / 3600 ) }:` ;
     const min = parseInt( ( seconds % 3600 ) / 60 ) == 0 ?
         '' : `${ parseInt( ( seconds % 3600 ) / 60 ) }:`;
     const sec = seconds % 60 == 0 ?
         '00' : `${ seconds % 60 }`;
     
     const time = hour + min + sec;
     return time;
 };
 
 module.exports = timeUnit;