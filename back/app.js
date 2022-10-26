const express = require('express');
const mongoose = require('mongoose');

// const sauceRoutes = require('./routes/sauces');
const path = require('path');

const app = express();
app.use(express.json());
const userRoutes = require('./routes/user');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

mongoose.connect('mongodb+srv://Diariata:Azerty1234@cluster0.9se0x0b.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch((e) => console.log(e));




app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
// app.use('/api/sauces', sauceRoutes);
module.exports = app

