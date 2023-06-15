const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())



//mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvsxjlv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const classesCollection = client.db('apexSportsDb').collection('classes')
        const instructorsCollection = client.db('apexSportsDb').collection('instructors')
        const usersCollection = client.db('apexSportsDb').collection('users')
        const selectionCollection = client.db('apexSportsDb').collection('selections')

        //Classes related api
        app.get('/classes', async (req, res) => {
            console.log(req.query.limit)
            const limit = parseInt(req.query.limit);
            const options = {
                sort: { no_of_students: -1 },
                limit: limit
            };
            const result = await classesCollection.find({}, options).toArray()
            res.send(result)
        })

        //Instructors related api
        app.get('/instructors', async (req, res) => {
            console.log(req.query.limit)
            const limit = parseInt(req.query.limit);
            const result = await instructorsCollection.find().limit(limit).toArray()
            res.send(result)
        })

        //Users related api
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        app.get('/users/:email', async (req, res) => {
            console.log(req.params.email)
            const query = { email: req.params.email }
            const result = await usersCollection.findOne(query)
            console.log(result, query)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.send(result)
        })

        //Selections related api
        app.get('/selections',async (req, res) => {
            const email = req.query.email
            // if (!email) {
            //     res.send([])
            // }

            // const decodedEmail = req.decoded.email
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ error: true, message: 'forbidden access' })
            // }
            const query = { email: email };
            const result = await selectionCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/selections', async (req, res) => {
            const selected = req.body
            const result = await selectionCollection.insertOne(selected)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Apex sports is busy playing')
})

app.listen(port, () => {
    console.log(`Apex sports server is running on port: ${port}`)
})
