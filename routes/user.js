import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const userRoute = Router()

userRoute.post('/login', UserController.login)
userRoute.post('/register', UserController.register)
userRoute.post('/logout', UserController.logout)

userRoute.get('/session', UserController.session)
