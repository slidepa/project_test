const saleForm = document.getElementById('saleForm');
const saleList = document.getElementById('sales');

async function displaySales() {
    const saleForm = document.getElementById('saleForm');
    const saleList = document.getElementById('sales');
    try {
        const response = await fetch('/sales');
        if (!response.ok) {
            throw new Error('Ошибка получения продаж');
        }
        const sales = await response.json();
        saleList.innerHTML = '';
        sales.forEach(sale => {
            const saleItem = document.createElement('li');
            saleItem.innerHTML = `
        <p><strong>Товар:</strong> ${sale.item}</p>
        <p><strong>Количество:</strong> ${sale.amount}</p>
        <p><strong>Сумма:</strong> ${sale.summar}</p>
        <p><strong>Дата продажи:</strong> ${moment(sale.sell_date).format('DD.MM.YYYY')}</p>
        <p><strong>Продавец:</strong> ${sale.nameseller} ${sale.surnameseller}</p>
      `;
            saleList.appendChild(saleItem);
        });
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

displaySales();

saleForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const item = document.getElementById('saleItem').value;
    const amount = document.getElementById('saleAmount').value;
    const summar = document.getElementById('saleSummar').value;
    const nameseller = document.getElementById('saleName').value;
    const surnameseller = document.getElementById('saleSurname').value;
    const sell_date = document.getElementById('saleDate').value;

    try {
        const response = await fetch('/addSale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ item, amount, summar, nameseller, surnameseller, sell_date }),
        });

        if (!response.ok) {
            throw new Error('Ошибка создания задачи');
        }

        alert('Задача успешно добавлена');
        displaySales(); // Обновить отображение задач после добавления новой задачи
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка. Задача не была добавлена. Возможно непрвильно введены данные сотрудника.');
    }

});

document.addEventListener('DOMContentLoaded', () => {
    // Получение данных о продажах из сервера
    async function fetchSalesData() {
        try {
            const response = await fetch('/sales');
            if (!response.ok) {
                throw new Error('Ошибка получения продаж');
            }
            const salesData = await response.json();
            return salesData;
        } catch (error) {
            console.error('Ошибка:', error);
            return [];
        }
    }

    // Функция для построения графика продаж по месяцам
    async function buildSalesChart() {
        const salesData = await fetchSalesData();
        const monthlySales = {};

        // Обработка данных о продажах и группировка по месяцам
        salesData.forEach(sale => {
            const saleDate = new Date(sale.sell_date);
            const monthYear = `${saleDate.getMonth() + 1}/${saleDate.getFullYear()}`;

            if (!monthlySales[monthYear]) {
                monthlySales[monthYear] = 0;
            }

            monthlySales[monthYear] += sale.summar; // Используйте нужное поле суммы продаж
        });

        // Получение месяцев и сумм продаж для оси X и Y соответственно
        const months = Object.keys(monthlySales);
        const salesValues = Object.values(monthlySales);

        const salesByMonth = Object.keys(monthlySales).sort((a, b) => {
            const [aMonth, aYear] = a.split('/');
            const [bMonth, bYear] = b.split('/');
            return new Date(`${aYear}-${aMonth.padStart(2, '0')}`) - new Date(`${bYear}-${bMonth.padStart(2, '0')}`);
        });

        const salesValuesSorted = salesByMonth.map(monthYear => monthlySales[monthYear]);

        // Создание графика с помощью Chart.js
        const salesChartCanvas = document.getElementById('salesChartCanvas');
        const salesChart = new Chart(salesChartCanvas, {
            type: 'bar',
            data: {
                labels: salesByMonth,
                datasets: [{
                    label: 'Продажи по месяцам',
                    data: salesValuesSorted,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            callback: function(value, index, values) {
                                if (typeof value === 'string') {
                                    const [month, year] = value.split('/');
                                    return `${month}/${year}`;
                                }
                                return value;
                            }
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Вызов функции построения графика
    buildSalesChart();
});