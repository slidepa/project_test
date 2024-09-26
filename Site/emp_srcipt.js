// Функция для отображения списка сотрудников
async function displayEmployees() {
    try {
        const response = await fetch('/employees'); // Получение списка сотрудников с сервера
        if (!response.ok) {
            throw new Error('Ошибка получения данных');
        }
        const employeesData = await response.json();
        const employeesList = document.getElementById('employees');
        employeesList.innerHTML = ''; // Очистка списка перед обновлением

        employeesData.forEach(employee => {
            const listItem = document.createElement('li');
            listItem.textContent = `${employee.name} ${employee.surname} - ${employee.post}`;
            employeesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Функция для добавления нового сотрудника
async function addEmployee() {
    const name = document.getElementById('employeeName').value;
    const surname = document.getElementById('employeeSurname').value;
    const middleName = document.getElementById('employeeMiddleName').value;
    const dob = document.getElementById('employeeDOB').value;
    const experience = document.getElementById('employeeExperience').value;
    const post = document.getElementById('employeePost').value;
    const login = document.getElementById('employeeLogin').value;
    const pass = document.getElementById('employeePass').value;
    try {
        const response = await fetch('/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, surname, middleName, dob, experience, post, login, pass})
        });
        if (!response.ok) {
            throw new Error('Ошибка добавления сотрудника');
        }
        displayEmployees(); // После добавления сотрудника обновляем список
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// При загрузке страницы загружаем список сотрудников с сервера
displayEmployees();