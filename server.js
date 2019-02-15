const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');

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

app.post('/signin', (req, res) => {
   database.select('email', 'hash').from('login')
      .where('email', '=', req.body.email)
      .then(data => {
         const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
         if (isValid) {
            return database.select('*').from('users')
               .where('email', '=', req.body.email)
               .then(user => {
                  res.json(user[0]);
               })
               .catch(error => res.status(400).json('unable to get user'));
         } else {
            res.status(400).json('wrong password');
         }
      })
      .catch(err => res.status(400).json('wrong credentials'));
});

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