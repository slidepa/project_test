window.addEventListener('DOMContentLoaded', (event) => {
    const carsList = document.getElementById('carsList');
    const addCarForm = document.getElementById('addCarForm');
    const searchInput = document.getElementById('search');

    let carsData = []; // Инициализация переменной как пустого массива


    function displayCars(cars) {
        carsList.innerHTML = '';
        cars.forEach(car => {
            const carDiv = document.createElement('div');
            carDiv.classList.add('car');
            carDiv.dataset.brand = car.brand;
            carDiv.dataset.model = car.model;
            carDiv.innerHTML = `
                <img src="car.jpg" alt="${car.brand} ${car.model}">
                <h2>${car.brand} ${car.model}</h2>
                <p>Год: ${car.year}</p>
                <p>Цена: $${car.price}</p>
            `;
            carsList.appendChild(carDiv);
        });
    }

    // Получение данных с сервера (предположим, это функция загрузки данных)
    async function getCarsFromServer() {
        try {
            const response = await fetch('/cars');
            if (!response.ok) {
                throw new Error('Ошибка получения данных');
            }
            const data = await response.json();
            carsData = data; // Присвоение полученных данных переменной carsData
            displayCars(carsData); // Отображение данных
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    // Выполнение поиска при вводе текста в поле поиска
    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.trim();
        filterCars(searchText);
    });

    // Загрузка данных с сервера при загрузке страницы
    getCarsFromServer();


// Загрузка данных с сервера при загрузке страницы
getCarsFromServer();

// Функция для фильтрации автомобилей по запросу пользователя
function filterCars(query) {
    const filteredCars = carsData.filter(car =>
        car.brand.toLowerCase().includes(query.toLowerCase()) ||
        car.model.toLowerCase().includes(query.toLowerCase())
    );
    displayCars(filteredCars);
}

// Выполнение поиска при вводе текста в поле поиска
searchInput.addEventListener('input', function(event) {
    const searchText = event.target.value.trim();
    filterCars(searchText);
});


// Функция для добавления автомобиля в базу данных
async function addCarToServer(brand, model, year, price) {
    try {
        const response = await fetch('/addCar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ brand, model, year, price })
        });
        if (!response.ok) {
            throw new Error('Ошибка добавления автомобиля');
        }
        await displayCars();
    } catch (error) {
        console.error('Ошибка:', error);
    }
}


addCarForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value;

    if (brand && model && year && price) {
        addCarToServer(brand, model, year, price);
        addCarForm.reset();
        location.reload(true);
    } else {
        alert('Пожалуйста, заполните все поля');
    }
});

displayCars();});