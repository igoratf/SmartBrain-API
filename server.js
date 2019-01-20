const express = require('express');

const app = express();


app.get('/', (req, res) => {
   res.send('this is working');
})

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