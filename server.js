const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const database = knex({
   client: 'pg',
   connection: {
      host: '127.0.0.1',
      user: 'igor',
      password: 'pass',
      database: 'smart-brain'
   }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());



app.get('/', (req, res) => {
   // res.send(database.users);
});

app.post('/signin', (req, res) => {signin.handleSignIn(req, res, database, bcrypt)});

app.post('/register', (req, res) => {register.handleRegister(req, res, database, bcrypt)});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, database)});


app.put('/image', (req, res) => {image.handleImage(req, res, database)});

app.listen(3000, () => {
   console.log('listening port 3000');
});


/*
/ --> res = root base working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/