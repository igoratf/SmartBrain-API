const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const tempDatabase = {
   users: [
      {
         id: '123',
         name: 'Donkey',
         email: 'donkey@email.com',
         password: 'kong',
         entries: 0,
         joined: new Date()
      }
   ],

   login: [
      {
         id: '987',
         hash: '',
         email: '',
      }
   ]

}


app.get('/', (req, res) => {
   res.send(tempDatabase.users);
});

app.post('/signin', (req, res) => {
   if (req.body) {
      tempDatabase.users.forEach(user => {
         if (user.email === req.body.email && user.password === req.body.password) {
            res.json('success');
         }
      })
   }
   res.status(400).json('error logging in');
});

app.post('/register', (req, res) => {
   const { email, password, name } = req.body;
   console.log('req', req.body);
   if (req.body) {
      tempDatabase.users.push({
         id: 125,
         email: email,
         password: password,
         name: name,
         entries: 0,
         joined: new Date()
         
      });
      res.json(tempDatabase.users[tempDatabase.users.length - 1]);
   }

   res.status(400).json('error registering');

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