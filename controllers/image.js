const Clarifai = require('clarifai');

const app = new Clarifai.App({
   apiKey: 'e818b2d0d9e94de880adf296a3184e56'
 });

 const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
   .then(data => {
      res.json(data);
   })
   .catch(err => res.status(400).json('unable to work with API'));
 }

const handleImage = (database) => (req, res) => {
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
}

module.exports = {
   handleImage,
   handleApiCall
}