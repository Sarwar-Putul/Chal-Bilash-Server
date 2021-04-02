const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5okrn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const riceCollection = client.db("riceStore").collection("rices");
  const ordersCollection = client.db("riceStore").collection("orders");
  console.log('database connection established')

  app.post('/addRice', (req, res) => {
    const addedRice =req.body;
    console.log('adding new rice',addedRice);
    riceCollection.insertOne(addedRice)
    .then(result => {
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })


  app.get('/rices', (req, res) => {
    riceCollection.find()
    .toArray((err, items) => {
      res.send(items)
      //console.log('form mongodb database', items)
    })
  })

  app.get('/rice/:id', (req, res) => {
    riceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, items) => {
      res.send(items[0]);
    })
  })
  app.delete('/delete/:id', (req, res) => {
    // console.log(req.params.id);
    riceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })


  app.post('/checkout', (req, res) => {
    const orderPlacement = req.body;
    ordersCollection.insertOne(orderPlacement)
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0);
    })
    console.log("my data",orderPlacement);
  })

  app.get('/order/:email', (req, res) => {
    ordersCollection.find({email: req.params.email})
    .toArray((err, items) => {
      res.send(items);
    })
  })

  
  
//   client.close();
});




app.listen(process.env.PORT || port)