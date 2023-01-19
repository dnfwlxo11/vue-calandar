// 로컬 스토리지 기반 컨트롤
function selectData(tableName) {
    return JSON.parse(localStorage.getItem(tableName));
}

function insertData(tableName, data) {
    localStorage.setItem(tableName, JSON.stringify(data));

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