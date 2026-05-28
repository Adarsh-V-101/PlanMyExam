const express = require('express');
const app = express();
const routes = require('./routesController/controller')
const port = 3000;
const mongoose = require('mongoose');
// require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));

app.get('/', routes);
app.post('/userData', routes);

mongoose.connect("mongodb://127.0.0.1:27017/palnMyExam")
.then(() => {
    console.log("Connected to MongoDB");
});

app.listen(port, () => {  
    console.log(`App listening at http://localhost:${port}`);
});