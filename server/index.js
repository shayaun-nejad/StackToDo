const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoUrl = require('../config/config.js').mongoURL 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, '../client/dist/')));

/// mongoose stuff
const mongoose = require('mongoose');
const mongoDB = mongoUrl;
mongoose.connect(mongoDB, { useNewUrlParser: true } , () => {
  console.log('dayum')
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

var Schema = mongoose.Schema

var todoSchema = new Schema({
  value: String,
  id: Number
});

var doneSchema = new Schema({
  value: String
});

var Todo = mongoose.model('Todo', todoSchema);
var Final = mongoose.model('Final', doneSchema);


app.post('/:n', (req, res) => {
  var numero = req.params.n;

  if (numero === '1') {
  Todo.create({
    value: req.body.data
  });
  } else if (numero === '2') {
    console.log('yah')
    var text = req.body.data
    Final.create({
      value: req.body.data
    }).then(() => {
      Todo.findOneAndRemove({'value': `${text}`}, (request, response) => {
        console.log(request);
        console.log(response)
      });
    });
    }
});

app.get('/:n', (req, res) => {
  var numero = req.params.n;
  if (numero === '1') {
    Todo.find((err, todos) => {
      if (err) {
        console.log(err);
      } else {
        res.send(todos);
      }
    });
  } else if (numero === '2') {
      Final.find((err, final) => {
        if (err) {
          console.log(err);
        } else {
          res.send(final);
        }
      });
    }     
  });

app.delete('/:n', (req, res) => {
  if (req.params.n === '1') {
    Final.remove({}, () => {});
    Todo.remove({}, () => {});  
  }
});

app.use((req, res, next) => {
  console.log(`serving request ${req.method} at ${req.url}`);
  next();
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
  console.log(`Listening on port ${PORT}`);
});
