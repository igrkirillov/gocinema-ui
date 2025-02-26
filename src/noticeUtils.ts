export function validateEditAndNotice(isEditEnabled: boolean) {
    if (!isEditEnabled) {
        alert("Для редактирования остановить продажу билетов!");
    }
    return isEditEnabled;
}