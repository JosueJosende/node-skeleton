import express from 'express'
import cookieParser from 'cookie-parser'

import { PORT } from './config.js'
import { corsMiddleware } from './middlewares/cors.js'
import { accessTokenMiddleware } from './middlewares/access_token.js'
import { userRoute } from './routes/user.js'
import { protectedRoute } from './routes/protected.js'

const app = express()
app.disable('x-powered-by')

app.use(express.static('public'))

app.use(express.json(/* { limit: '50mb' } */))
app.use(express.urlencoded({ extended: true /* , limit: '50mb' */ }))
app.use(cookieParser())

app.use(corsMiddleware())
app.use(accessTokenMiddleware())

app.use('/user', userRoute)
app.use('/protected', protectedRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
