/**
 * 숫자에 단위를 붙여주는 함수
 * @param { number } number 단위 붙이기 원하는 숫자
 * @returns 단위 붙인 숫자
 */
 function numberToKorean( number )
 {
     let plus = '';
     
     if ( number < 0 )
     {
         plus = '-';
         number = Math.abs( number );
     }
 
     let inputNumber  = number < 0 ? false : number;
     let unitWords    = ['', '만 ', '억 ', '조 ', '경 '];
     let splitUnit    = 10000;
     let splitCount   = unitWords.length;
     let resultArray  = [];
     let resultString = '';
 
     for ( let i = 0; i < splitCount; i++)
     {
         let unitResult = ( inputNumber % Math.pow( splitUnit, i + 1 )) / Math.pow( splitUnit, i );
         unitResult = Math.floor( unitResult );
         if ( unitResult > 0 )
         {
             resultArray[ i ] = unitResult;
         }
     }
 
     for ( let i = 0; i < resultArray.length; i++ )
     {
         if ( !resultArray[ i ] )
         {
             continue
         };
         resultString = String( resultArray[ i ] ) + unitWords[ i ] + resultString;
     }
 
     resultString = plus + resultString
 
     if ( !resultString )
     {
         resultString = '0';
     }
     return resultString;
 };
 
 module.exports = numberToKorean;