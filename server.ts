import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import schemas from './src/collections'
import {fieldsToSchema,saveFiles,parse} from './src/utils/utils'
import env from "./env"
import multer from "multer"

// mongoose.connect(`mongodb+srv://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DB_NAME}?retryWrites=true&w=majority`);

mongoose.connect(env.DB_HOST, {
  authSource: "admin",
  user: env.DB_USER,
  pass: env.DB_PASSWORD,
  dbName: env.DB_NAME,
});

  let collections:{[Key:string]:mongoose.Model<any>} = {}
 

  for(let schema of schemas){

    const schema_object = new mongoose.Schema(fieldsToSchema(schema.fields),{strict:schema.strict||false});
    collections[schema.name]=mongoose.model(schema.name, schema_object);
  }

  const app = express()

  app.use(multer().any())

  app.use(cors())


  app.get('/get_collections', async (req, res) => {
    console.log(schemas)
      
    res.send(schemas)
  })
  app.get("/api/findById",async (req,res)=>{
    let collection  = collections[req.query.collection as string]
    res.send(await collection.findById(req.query.id as string))
  })
  app.get("/api/find",async (req,res)=>{
    let collection  = collections[req.query.collection as string]
    res.send(await collection.find(JSON.parse(req.query.query as string)))
  })

   app.get('/api/:endpoint', async (req, res) => {
    let collection  = collections[req.params.endpoint]
    res.send(await collection.find())
    })


    app.patch('/api/:endpoint', async (req, res) => {
      let collection  = collections[req.params.endpoint]
      let {_id,...formData} = req.body
      console.log(formData)
      formData = parse(formData)
      console.log(formData)
      let files = saveFiles(req)
      res.send(await collection.updateOne({_id},{...formData,...files},{upsert: true}))
      })


    app.delete('/api/:endpoint', async (req, res) => {
      let collection  = collections[req.params.endpoint]
      let {ids} = req.body
      ids = JSON.parse(ids)
      console.log(ids)
      console.log(typeof ids)
    
      res.send(await collection.deleteMany({
        _id: {
          $in: ids
        }
      }))
    })


    app.post('/api/:endpoint', async (req, res) => {
        for(let key in req.body){
          try{
            req.body[key] = JSON.parse(req.body[key])} catch(e){}
        }
        let collection  = collections[req.params.endpoint]
        if(!collection)  return "collection not found!!"
        let files = saveFiles(req)        
        res.send(await collection.insertMany({...req.body,...files}))
      }) 
 

  app.listen(env.PORT, () => {
    console.log(`Example app listening on port ${env.PORT}`)
  })

