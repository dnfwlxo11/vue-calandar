// 로컬 스토리지 기반 컨트롤
function selectData(tableName) {
    return JSON.parse(localStorage.getItem(tableName));
}

function insertData(tableName, data) {
    localStorage.setItem(tableName, JSON.stringify(data));

    return JSON.parse(localStorage.getItem(tableName));
}

function updateData(tableName, data) {}

function deleteData(tableName, data) {}

export default {
    insertData,
    updateData,
    deleteData,
    selectData,
}