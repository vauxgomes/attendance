// Imports
const express = require('express')
const cors = require('cors')

const dotenv = require('dotenv')
dotenv.config()

const { PORT, NODE_ENV } = process.env

// Routes
const routes = require('./routes')

// App
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(routes)

// PORT
app.listen(PORT)

// Start message
console.log('\x1b[32mServer Running\x1b[0m')
console.log(' - \x1b[2mPORT:\x1b[0m', PORT)
console.log(' - \x1b[2mENVIRONMENT:\x1b[0m', NODE_ENV)