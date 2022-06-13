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
    },
    // price:{
    //     type:Sequelize.INTEGER,
    //     allowNull:false,
    //     validate:{
    //         notEmpty:true
    //     }
    // }
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
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

Order.belongsTo(Cupcake)
Order.belongsTo(Customer)

const setUp = async()=> {
    await db.sync({force:true})
    const cupcakes = await Promise.all(
        [Cupcake.create({name:'chocolate',price:3}),
         Cupcake.create({name:'vanilla',price:4}),
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


app.get('/cupcake',async(req,res,next)=>{
    try{
     res.send(await Cupcake.findAll())
    }catch(err){
        next(err)
    }
})

app.get('/customer',async(req,res,next)=>{
    try{
     res.send(await Customer.findAll())
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