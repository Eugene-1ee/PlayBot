/**
 * 숫자를 랜덤으로 뽑아주는 함수
 * @param { number } min 최솟값
 * @param { number } max 최댓값
 * @returns 사잇값
 */
function randomNum( min, max )
{
    const randNum = Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    return randNum;
};

module.exports = randomNum;