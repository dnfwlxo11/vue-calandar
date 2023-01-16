function extractDateInfor() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // 일 0, 월 1, 화 2, 수 3, 목 4, 금 5, 토 6
    const day = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const msecond = date.getMilliseconds();
    const maxDay = date.getDate();

    return {
        year,
        month,
        day,
        hour,
        minute,
        second,
        msecond,
        maxDay
    }
}

const dateUtils = {
    extractDateInfor,
}

export default dateUtils;