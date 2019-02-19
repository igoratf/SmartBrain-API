const handleSignIn = (database, bcrypt) => (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return res.status(400).json('invalid email or password');
   }
   database.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
         const isValid = bcrypt.compareSync(password, data[0].hash);
         if (isValid) {
            return database.select('*').from('users')
               .where('email', '=', email)
               .then(user => {
                  res.json(user[0]);
               })
               .catch(error => res.status(400).json('unable to get user'));
         } else {
            res.status(400).json('wrong password');
         }
      })
      .catch(err => res.status(400).json('wrong credentials'));
}

module.exports = {
   handleSignIn: handleSignIn
}