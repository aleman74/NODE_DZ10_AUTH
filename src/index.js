require('dotenv').config();        // Иначе не подхватываются параметры из .env

const path = require('path');

const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.urlencoded({extended: false}));          // для POST и PUT запросов

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));     // Устанавливаем директорию с шаблонами

// ---------------------------------------------
// Включаем обработку авторизации
// ---------------------------------------------
const my_pwd = require('./middle/my_pwd');

app.use(session({ secret: 'SECRET', cookie: { last_url: '/' }}));
app.use(my_pwd.initialize());      
app.use(my_pwd.session());

// ---------------------------------------------
// Обработчики запросов
// ---------------------------------------------
const user_router = require('./router/user');
app.use('/api/user/', user_router);

// ---------------------------------------------
// Запуск сервера
// ---------------------------------------------
const {PORT} = require('./config');

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/api/user/login`)
});

// ---------------------------------------------
