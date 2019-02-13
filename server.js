const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const database = knex({
   client: 'pg',
   connection: {
      host: '127.0.0.1',
      user: 'igor',
      password: 'pass',
      database: 'smart-brain'
   }
});

database.select('*').from('users').then(data => console.log(data));

const app = express();

app.use(bodyParser.json());
app.use(cors());



app.get('/', (req, res) => {
   // res.send(database.users);
});

app.post('/signin', (req, res) => {
   if (req.body) {
      database.users.forEach(user => {
         if (user.email === req.body.email && user.password === req.body.password) {
            return res.json(user);
         }
      })
   }
   res.status(400).json('error logging in');
});

app.post('/register', (req, res) => {
   const { email, name, password } = req.body;
   const hash = bcrypt.hashSync(password);
   database.transaction(trx => {
      trx.insert({
         hash: hash,
         email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
         return trx('users')
            .returning('*')
            .insert({
               email: loginEmail[0],
               name: name,
               joined: new Date()
            })
            .then(user => {
               res.json(user[0]);
            })
      })
      .then(trx.commit)
      .catch(trx.rollback);
   })
   .catch(() => res.status(400).json('not able to register'));


});

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
   database('users')
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