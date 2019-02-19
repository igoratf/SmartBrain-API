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
   return res.send('App is running');
});

app.post('/signin', signin.handleSignIn(database, bcrypt));
app.post('/register', register.handleRegister(database, bcrypt));
app.get('/profile/:id', profile.handleProfileGet(database));
app.put('/image', image.handleImage(database));
app.post('/imageurl', image.handleApiCall);


app.listen(process.env.PORT || 3000, () => {
   console.log(`listening port 3000 ${process.env.PORT}`);
});


/*
/ --> res = root base working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user
*/