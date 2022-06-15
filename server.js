const express = require('express')
const app = express()
const Sequelize = require('sequelize')
const path = require('path')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_express_spa')

const Cupcake = db.define('cupcake',{
    name:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    }
})

const Customer = db.define('customer',{
    name:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            notEmpty:true
        }
    }
})

const Order = db.define('order',{
   
})

Order.belongsTo(Cupcake)
Order.belongsTo(Customer)

const setUp = async()=> {
    await db.sync({force:true})
    const cupcakes = await Promise.all(
        [Cupcake.create({name:'chocolate',price:3}),
         Cupcake.create({name:'vanilla',price:4}),
         Cupcake.create({name:'red-velvet',price:5}),
         Cupcake.create({name:'banana',price:5})
        ])
    const customers = await Promise.all(
        [Customer.create({name:'Tom'}),
         Customer.create({name:'Niko'}),
         Customer.create({name:'Lily'})
    ])
}

const init = ()=>{
    try{
      setUp()
    }catch(err){
      next(err)
    }
}

init()

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`App is listening at:${port}`)
})

app.use(express.json())
app.use('/assets', express.static('assets'))
app.use('/dist', express.static('dist'))


app.get('/customer',async(req,res,next)=>{
    try{
     res.send(await Customer.findAll())
    }catch(err){
        next(err)
    }
})

app.get('/cupcake',async(req,res,next)=>{
    try{
     res.send(await Cupcake.findAll())
    }catch(err){
        next(err)
    }
})

app.get('/order',async(req,res,next)=>{
    try{
     let data = await Order.findAll()
     res.send(data)
    }catch(err){
        next(err)
    }
})

app.post('/order',async(req,res,next)=>{
    try{
        console.log(req.params) //no req.params in post router, req.params exist in get and delete router
        console.log('%%%%%%%%%%%%%%%%')
        console.log(req.body) //req.body===axios.post('/order',data)
        await Order.create(req.body)
        res.status(201).send()
    }catch(err){
        next(err)
    }
})

app.delete('/order/:id',async(req,res,next)=>{
    try{
      console.log('******************')
      console.log(':id = ', req.params.id) //req.params.id exist in get and delete router
      const row = await Order.findByPk(req.params.id)
      await row.destroy()
      res.status(204).send()
    }catch(err){
      next(err)
    }
})

app.get('/',async(req,res,next)=>{
    try{
      res.sendFile(path.join(__dirname,'index.html'))
    }catch(err){
        next(err)
    }
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send(err)
})