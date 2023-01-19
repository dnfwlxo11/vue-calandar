// 로컬 스토리지 기반 컨트롤

function customSort(data) {
    const newData = JSON.parse(JSON.stringify(data));
    
    const years = Object.keys(newData);

    years.map((year) => {
        Object.keys(newData[year]).map((month) => {
            Object.keys(newData[year][month]).map((day) => {
                newData[year][month][day].sort((a, b) => {
                    if (a.time === 'all' && b.time === 'all') return 0;
                    if (a.time === 'all') return -1;
                    if (b.time === 'all') return 1;
                    if (a.time < b.time) return -1;
                    else return 1;
                })
            })
        })
    })

    return newData
}

function selectData(tableName) {
    return JSON.parse(localStorage.getItem(tableName));
}

function insertData(tableName, data) {
    tableName === 'calendarData' 
        ? localStorage.setItem(tableName, JSON.stringify(customSort(data)))
        : localStorage.setItem(tableName, JSON.stringify(data))
    

    return JSON.parse(localStorage.getItem(tableName));
}

function updateData(tableName, data) {
    let fullData = JSON.parse(localStorage.getItem(tableName));

    fullData = { ...fullData, ...data };
    localStorage.setItem(tableName, JSON.stringify(fullData));

    return JSON.parse(localStorage.getItem(tableName));
}

function deleteData(tableName, data) {}

export default {
    insertData,
    updateData,
    deleteData,
    selectData,
}