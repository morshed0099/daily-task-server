const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const userCollection = client.db('daily_task').collection('users')
const taksCollection = client.db('daily_task').collection('taks')
async function run() {
    try {
        app.post('/users', async (req, res) => {
            const query = req.body
            const result = await userCollection.insertOne(query);

            res.send(result);
        })
        app.post('/tasks', async (req, res) => {
            const query = req.body;
            const result = await taksCollection.insertOne(query);

            res.send(result);
        })
        app.get('/allTaks', async (req, res) => {
            const query = {}
            const cursor = taksCollection.find(query)
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/myTask', async (req, res) => {
            const email = req.query.email;

            const query = {
                authorEmail: email,
                complete: false
            }
            const result = await taksCollection.find(query).toArray()

            res.send(result);

        })
        app.patch('/tasks/:matchid', async (req, res) => {
            const id = req.params.matchid;
            console.log(id,)
            const updateItmes = req.body
            const title = updateItmes.upTitle;
            const dedescription = updateItmes.upDescription
            const imgaes = updateItmes.upImgaes
            const query = ({ _id: ObjectId(id) })
            const updateDoc = {
                $set: {
                    title: title,
                    dedescription: dedescription,
                    imgaes: imgaes,
                }

            }
            const result = await taksCollection.updateOne(query, updateDoc)
            console.log(result);
            res.send(result);


        })
        app.patch('/complete/:id', async (req, res) => {
            const id = req.params.id
            const complete = req.body
            const query = ({ _id: ObjectId(id) })
            updateDoc = {
                $set: {
                    complete: true
                }
            }
            const result = await taksCollection.updateOne(query, updateDoc)
            console.log(result);
            res.send(result);
        })
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id
            const query = ({ _id: ObjectId(id) })
            const result = await taksCollection.findOne(query)
            res.send(result);
        })
        app.get('/completetask/:email',async(req,res)=>{
            const email=req.params.email
            const query={
                authorEmail: email,
                complete: true
            }
            const result = await taksCollection.find(query).toArray()
            res.send(result);
        })
        app.delete('/completetask/:id',async(req,res)=>{
            const id=req.params.id
            const query =({_id:ObjectId(id)})
            const result=await taksCollection.deleteOne(query)
            res.send(result);
        })
        app.patch('/incomplete/:id',async(req,res)=>{
            const id=req.params.id
            const query=({_id:ObjectId(id)})
            const complete=false
            const updateDoc={
                $set:{
                    complete:complete
                }
            }
            const result=await taksCollection.updateOne(query,updateDoc)
            res.send(result);
        })

    } finally {

    }
} run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, console.log(`server is running ${port}`)

)