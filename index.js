const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

// set middleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krzs8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)
// worldTevily
// u7N4f8zewM69CLd5
async function run() {
    try {
        await client.connect();

        const database = client.db("worldTevily");
        const servicesCollection = database.collection("services");

        // GET API  for Services
        app.get('/services', async(req, res)=>{
           const cursor = servicesCollection.find({});
           const services = await cursor.toArray();
           res.send(services);
        })

        // POST API for service
        app.post('/services', async(req, res)=>{
            const service = req.body;
            // console.log('service post hitting', req.body);
            const result = await servicesCollection.insertOne(service);
            console.log(`inserted id, ${result.insertedId}`);
            res.json(result);

        })
       

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('world tevily! running server')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})