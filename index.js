
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b3llw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000

app.get('/', (req, res) => {
    res.send('hello my name is daily news')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const newsCollection = client.db("ajkerNews").collection("news");
    const adminCollection = client.db("ajkerNews").collection("admin");

    app.post('/addNews', (req, res) => {
        const news = req.body;
        newsCollection.insertOne(news)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/news', (req, res) => {
        newsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/nationalNews', (req, res) => {
        newsCollection.find({ category: { $regex: 'national' } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/worldNews', (req, res) => {
        newsCollection.find({ category: { $regex: 'world' } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/sportsNews', (req, res) => {
        newsCollection.find({ category: { $regex: 'sports' } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.post('/addAdmin', (req, res) => {
        const admin = req.body;
        adminCollection.insertOne(admin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })

});

app.listen(process.env.PORT || port)