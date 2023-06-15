const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app=express();
const port= process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res)=> {
    res.send('Apex sports is busy playing')
})

app.listen(port, ()=> {
    console.log(`Apex sports server is running on port: ${port}`)
})
