const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.izqajim.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
        
    try{
           const blogCollection = client.db('harmicUser').collection('blogs');


                /////all get api/////////////////
            //get blog api
            app.get('/blogs', async (req, res)=>{
                const result = await blogCollection.find({}).toArray();
                if(result.length){
                    res.send({result, success: true})
                }
                else{
                    res.send({success: false, message: 'Something went wrong'})
                }
            })

         
           
            app.get('/blogs/:email', async (req, res)=>{
                const email = req.params.email;
                const filter = {authorEmail: email};
                const result = await blogCollection.find(filter).toArray();
                if(result.length){
                    res.send({result, success: true})
                }
                else{
                    res.send({success: false, message: 'Something went wrong'})
                }
    
            })

           //blog post api
           app.post('/blogs', async(req, res) =>{
            const blog = req.body;
            const result = await blogCollection.insertOne(blog);
            if(result.insertedId){
                res.send({result, success: true})
            }
            else{
                res.send({success: false, message : 'Something went wrong'})
            }
           })


           //update blog
           app.put('/blogs/:id', async(req, res)=>{
            const id = req.params.id;
            const data= req.body;
            console.log(data);
            const filter = {_id:new ObjectId(id)};
            const updateDoc = {
                $set: data
            }
            const result = await blogCollection.updateOne(filter, updateDoc);
            if (result.acknowledged) {
                res.send({ result, success: true })
            }
            else {
                res.send({ success: false, message: 'Something went wrong' })
            }
           })


           //delete api
           app.delete('/blogs/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id:new ObjectId(id)};
            const result = await blogCollection.deleteOne(filter);
            if(result.acknowledged){
                res.send({result, success: true})
            }
            else{
                res.send({success: false, message: 'Something went wrong'})
            }
           })



    }
    finally{

    }
}
run().catch(err=>console.error(err));




app.get('/', (req, res) => {
    res.send('harmic server is running')
})

app.listen(port, () =>{
    console.log(`harmic server is listening on ${port}`);
})