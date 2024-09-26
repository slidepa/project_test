const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('tasks');

async function displayTasks() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('tasks');
    try {
        const response = await fetch('/tasks');
        if (!response.ok) {
            throw new Error('Ошибка получения задач');
        }
        const tasks = await response.json();
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
        <h3>${task.title}</h3>
        <p><strong>Описание:</strong> ${task.description}</p>
        <p><strong>Срок выполнения:</strong> ${moment(task.deadline).format('DD.MM.YYYY')}</p>
        <p><strong>Обязанное лицо:</strong> ${task.firstName} ${task.lastName}</p>
      `;
            taskList.appendChild(taskItem);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

displayTasks();

taskForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('employeeFirstName').value;
    const lastName = document.getElementById('employeeLastName').value;
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;

    try {
        const response = await fetch('/addTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, lastName, title, description, deadline }),
        });

        if (!response.ok) {
            throw new Error('Ошибка создания задачи');
        }

        alert('Задача успешно добавлена');
        displayTasks(); // Обновить отображение задач после добавления новой задачи
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка. Задача не была добавлена.');
    }
});