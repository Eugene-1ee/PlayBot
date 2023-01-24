/**
 * 숫자를 연월일로 바꿔주는 함수
 * @param { number } number.length 8자리 숫자
 * @returns xxxx년 xx월 xx일
 */
function dayToKo( number )
{
    let birthday = String( number );
    birthday = birthday.substr( 0 , 4 )+'년 '
    + ( birthday.substr( 4, 2 ).indexOf( 0 ) == '0' ? birthday.substr( 5, 1 ) : birthday.substr( 4, 2 ) ) + '월 '
    + ( birthday.substr( 6, 2 ).indexOf( 0 ) == '0' ? birthday.substr( 7, 1 ) : birthday.substr( 6, 2 ) ) + '일';

    return birthday;
};

module.exports = dayToKo;