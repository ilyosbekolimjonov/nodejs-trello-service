import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import usersRoutes from './src/routes/user.routes.js'
import boardsRoutes from './src/routes/board.routes.js'
import setupRoutes from './src/routes/setup.routes.js'
import { errorHandler } from './src/middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/', setupRoutes)
app.use('/', usersRoutes)
app.use('/', boardsRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})