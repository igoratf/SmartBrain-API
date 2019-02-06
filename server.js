const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const database = knex({
   client: 'pg',
   connection: {
     host : '127.0.0.1',
     user : 'igor',
     password : 'dbpass',
     database : 'smart-brain'
   }
 });

 database.select('*').from('users').then(data => console.log(data));

const app = express();

app.use(bodyParser.json());
app.use(cors());



app.get('/', (req, res) => {
   res.send(tempDatabase.users);
});

app.post('/signin', (req, res) => {
   if (req.body) {
      tempDatabase.users.forEach(user => {
         if (user.email === req.body.email && user.password === req.body.password) {
           return res.json(user);
         }
      })
   }
   res.status(400).json('error logging in');
});

app.post('/register', (req, res) => {
   const { email, name, password } = req.body;
   database('users')
   .returning('*')
   .insert({
      email: email,
      name: name,
      joined: new Date()
   })
   .then(user => {
      res.json(user[0]);
   })
   .catch(err => res.status(400).json('unable to register'));

});

app.get('/profile/:id', (req, res) => {
   const { id } = req.params;
   tempDatabase.users.forEach(user => {
      if (user.id === id) {
         return res.json(user);
      }
   })

   return res.status(404).json('user not found');
});


app.put('/image', (req, res) => {
   const { id } = req.body;
   tempDatabase.users.forEach(user => {
      if (user.id === id) {
         return res.json(++user.entries);
      }
   })

   return res.status(404).json('user not found');
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