const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
// console.log(ObjectId)
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
        const bookingCollection = database.collection("booking");

        // GET API  for Services
        app.get('/services', async(req, res)=>{
            
            const sort = {_id: -1}
           const cursor = servicesCollection.find({});
           const services = await cursor.sort(sort).toArray();
           res.send(services);
        })

        // GET single service API
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.findOne(query);
            res.json(result);
        })

        // POST API for service
        app.post('/services', async(req, res)=>{
            const service = req.body;
            // console.log('service post hitting', req.body);
            const result = await servicesCollection.insertOne(service);
            console.log(`inserted id, ${result.insertedId}`);
            res.json(result);

        })

        // POST API for Booking services
        app.post('/addBooking', async(req, res)=>{
            console.log('hitting for booking', req.body);
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            console.log(`inserted booking id, ${result.insertedId}`);
            res.json(result);
        })

        // Manage my booking 
        app.get('/myBooking/:email', async(req, res)=>{
            // console.log(req.params.email);
            const cursor = bookingCollection.find({"userEmail": req.params.email});
            const result = await cursor.toArray();
            console.log(result)
            res.json(result);

        })

        // GET API  for Manage Services
        app.get('/manageServices', async(req, res)=>{
            const cursor = bookingCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
         })

         // update status
         app.put('/updateStatus/:id',  async (req, res)=>{
            const id = req.params.id;
            console.log(id);
            const filter ={_id: ObjectId(id)};
            const updateDoc ={
                $set:{
                    status: 'Approved'
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc)
            console.log('status updated', id);
            res.send(result);
         })

         // DELETE API for Manage Service
        app.delete('/manageServices/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
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