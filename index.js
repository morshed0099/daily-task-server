const express=require ('express');
const app=express();
const port=process.env.PORT || 5000
const cors= require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const userCollection =client.db('daily_task').collection('users')
const taksCollection=client.db('daily_task').collection('taks')
async function run(){
try{
    app.post('/users',async(req,res)=>{
        const query=req.body
        const result= await userCollection.insertOne(query);
        console.log(result)
        res.send(result);
    })
    app.post('/tasks',async(req,res)=>{
        const query=req.body;
        const result= await taksCollection.insertOne(query);
        console.log(result);
        res.send(result);
    })

}finally{

}
}run().catch(error=>console.error(error))


app.get('/',(req,res)=>{
   res.send('server is running')
})

app.listen(port,console.log(`server is running ${port}`) 

)