function extractDateInfor(dateObj) {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    // 일 0, 월 1, 화 2, 수 3, 목 4, 금 5, 토 6

    const firstDay = 1;
    const lastDay = new Date(year, month, 0).getDate();
    const firstDate = new Date(`${year}-${month}-01`).getDay();
    const lastDate = new Date(`${year}-${month}-${lastDay}`).getDay();

    return {
        year,
        month,
        firstDay,
        lastDay,
        firstDate,
        lastDate,
    }
}

function getKoreanDate(dateNum) {
    const koreanDate = ['일', '월', '화', '수', '목', '금', '토'];

    return koreanDate[dateNum]
}

function getNow() {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = (dateObj.getDate()).toString().padStart(2, '0');
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();
    const second = dateObj.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

const dateUtils = {
    extractDateInfor,
    getKoreanDate,
    getNow,
}

export default dateUtils;