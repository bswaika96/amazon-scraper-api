require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const routes = require('./routes')

const app = express()

if(process.env.APPLICATION_STATE === 'development'){
    app.use(morgan("short"))
}

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello'
    })
})

app.use(routes.scrape)

const port = process.env.PORT_NUMBER || 5000 
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})