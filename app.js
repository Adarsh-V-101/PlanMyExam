require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./routesController/controller');
const port = 3000;
const mongoose = require('mongoose');
const loginMiddleware = require('./utilities/loginMiddleware');
const startDailyReminder = require('./utilities/cron');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());

app.get('/', routes);
app.post('/userData', routes);
app.post('/login', routes);
app.get('/home', loginMiddleware, routes);
app.get('/dashboard',loginMiddleware, routes);
app.get('/test', routes);

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
  console.log('MongoDB connected');
  // startDailyReminder(); 
});

app.listen(port, () => {  
    console.log(`App listening at http://localhost:${port}`);
});