import jwt from 'jsonwebtoken'

import { SECRET_KEY } from '../config.js'
import { UserRepository } from '../repositories/user-repository.js'

export class UserController {
  static async login(req, res) {
    const { username, password } = req.body

    try {
      const user = await UserRepository.login({ username, password })
      const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' })

      res
        .cookie('access_token', token, {
          httpOnly: true, // no se puede acceder al token desde el navegador
          secure: false, // solo se envía si la conexión es https
          sameSite: 'strict', // solo se envía si la petición es desde el mismo sitio o dominio
          maxAge: 3600000 // la cookie solo tiene validez de 1 hora
        })
        .json({ user, token })
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }

  static async register(req, res) {
    const { username, password, email } = req.body
    console.log(typeof username, typeof password, typeof email)

    try {
      const id = await UserRepository.create({ username, password, email })
      res.json({ id })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  static async logout(req, res) {
    res.clearCookie('access_token').json({ message: 'Sesión cerrada' })
  }

  static async session(req, res) {
    res.json(req.session.user)
  }
}
