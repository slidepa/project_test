// Функция для загрузки шапки на страницу
function includeHeader() {
    const headerContainer = document.getElementById('header'); // ID контейнера для шапки
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            headerContainer.innerHTML = xhr.responseText;
        }
    };

    xhr.open('GET', 'header.html', true);
    xhr.send();
}

// Вызов функции загрузки шапки на каждой странице
document.addEventListener('DOMContentLoaded', includeHeader);