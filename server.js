const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 3001;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Prororo:PassTutBil200@projectcluster.8ecixoj.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'Site')));

app.use(session({
  secret: 'key', // Secret key for signing the session ID cookie
  resave: false,
  saveUninitialized: true
}));
// Middleware for checking if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.employee) {
    return next();
  } else {
    return res.status(401).send('Неавторизованный доступ');
  }
};

//Страница каталога

app.get('/catalog', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site', 'Catalog.html'));
});

const carSchema = new Schema({
  brand: String,
  model: String,
  year: Number,
  price: Number
});

const Car = mongoose.model('Car', carSchema);

app.get('/cars', async (req, res) => {
  try {
    const carsData = await Car.find({});
    res.json(carsData);
  } catch (error) {
    res.status(500).send('Ошибка получения данных');
  }
});

// Маршрут для добавления нового автомобиля в базу данных
app.post('/addCar', async (req, res) => {
  const { brand, model, year, price } = req.body;
  if (brand && model && year && price) {
    try {
      const newCar = new Car({ brand, model, year, price });
      await newCar.save();
      res.status(200).send('Автомобиль добавлен');
    } catch (error) {
      res.status(500).send('Ошибка при добавлении автомобиля');
    }
  } else {
    res.status(400).send('Некорректные данные для добавления');
  }
});

//Страница сотрудников
app.get('/employes', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site', 'Employes.html'));
});

const employeeSchema = new mongoose.Schema({
  name: String,
  surname: String,
  middleName: String,
  dob: Date,
  experience: Number,
  post: String,
  login: String,
  pass: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }]
});

const Employee = mongoose.model('Employee', employeeSchema);

app.use(bodyParser.json());

// Маршрут для получения списка сотрудников
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).send('Ошибка получения данных');
  }
});

// Маршрут для добавления нового сотрудника
app.post('/employees', async (req, res) => {
  const { name, surname, middleName, dob, experience, post, login, pass} = req.body;
  if (name && surname && dob && experience && post && pass && login) {
    try {
      const newEmployee = new Employee({ name, surname, middleName, dob, experience, post, login, pass});
      await newEmployee.save();
      res.status(200).send('Сотрудник добавлен');
    } catch (error) {
      res.status(500).send('Ошибка при добавлении сотрудника');
    }
  } else {
    res.status(400).send('Некорректные данные для добавления');
  }
});


//Страница задач

app.get('/tas', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site', 'Tasks.html'));
});

const tasksSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  title: String,
  description: String,
  deadline: Date,
});

const Task = mongoose.model('Task', tasksSchema);

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Ошибка получения данных');
  }
});

app.post('/addTask', async (req, res) => {
  try {
    const { firstName, lastName, title, description, deadline } = req.body;

    const employee = await Employee.findOne({ name: firstName, surname: lastName });

    if (!employee) {
      return res.status(404).send('Сотрудник не найден');
    }

    const newTask = new Task({ firstName, lastName, title, description, deadline });
    await newTask.save();

    employee.tasks.push(newTask);
    await employee.save();

    res.status(200).send('Задача успешно добавлена');
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Ошибка сервера');
  }
});



//Страница продаж
app.get('/sal', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site', 'Sales.html'));
});

const salesSchema = new mongoose.Schema({
  item: String,
  amount: Number,
  summar: Number,
  nameseller: String,
  surnameseller: String,
  sell_date: Date,
});

const Sale = mongoose.model('Sale', salesSchema);

// Маршрут для получения списка продаж
app.get('/sales', async (req, res) => {
  try {
    const sales = await Sale.find({});
    res.json(sales);
  } catch (error) {
    res.status(500).send('Ошибка получения данных');
  }
});

// Маршрут для добавления новой продажи
app.post('/addSale', async (req, res) => {
  try {
    const { item, amount, summar, nameseller, surnameseller, sell_date } = req.body;

    const employee = await Employee.findOne({ name: nameseller, surname: surnameseller });

    if (!employee) {
      return res.status(404).send('Сотрудник не найден');
    }

    const newSale = new Sale({ item, amount, summar, nameseller, surnameseller, sell_date });
    await newSale.save();

    employee.sales.push(newSale);
    await employee.save();

    res.status(200).send('Задача успешно добавлена');
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Ошибка сервера');
  }
});



//Страница авторизации
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Site', 'Log_in.html'));
});

app.get('/login', (req, res) => {
  if (req.session && req.session.employee) {
    const { login, pass } = req.session.employee;
    res.send(`Логин: ${login}, Пароль: ${pass}`);
  } else {
    res.sendFile(path.join(__dirname, 'Site', 'Log_in.html'));
  }
});

app.post('/login', async (req, res) => {
  let { login, pass } = req.body;
  login = login.trim();
  pass = pass.trim();

  try {
    const employee = await Employee.findOne({ login, pass });

    if (!employee) {
      return res.status(404).send('Неправильные учетные данные');
    }

    req.session.employee = employee;
    res.redirect('/catalog');
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Ошибка сервера');
  }
});



app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});