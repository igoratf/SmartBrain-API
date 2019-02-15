const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');

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

app.get('/profile/:id', (req, res) => {
   const { id } = req.params;
   database('users').where({ id })
      .select('*')
      .then(user => {
         if (user.length) {
            res.json(user[0])
         } else {
            res.status(400).json('user not found');
         }
      })
      .catch(err => res.status(400).json('error retrieving user'));
});


app.put('/image', (req, res) => {
   const { id } = req.body;
   return database('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
         if (entries.length) {
            res.json(entries[0])
         } else {
            res.status(400).json('invalid entries');
         }
      })
      .catch(err => res.status(400).json('unable to get entries'));
});

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