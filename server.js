const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

console.log('__dirname', __dirname);

app.use(routes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/hw', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

app.listen(PORT, function() {
  console.log(`Listening on PORT: ${PORT}`);
});
