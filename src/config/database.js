const mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/decocayetana', {
mongoose.connect('mongodb://mongodb+srv://andy:andy@cluster0-jnbjz.mongodb.net/test?retryWrites=true&w=majority',{
  useCreateIndex: true,
  userNewUrlParser: true,
  useFindAndModify: false,
  //useUnifiedTopology: true
})

.then(db => console.log('DB is connected'))
.catch(err => console.error(err));
