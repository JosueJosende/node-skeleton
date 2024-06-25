import crypto from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

import { SALT_ROUNDS } from '../config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true }
})

export class UserRepository {
  static async create({ username, password, email }) {
    // Validaciones de username ( opcional zod )
    Validation.username(username)
    Validation.password(password)

    // Asegurarse de que el usuario no exista
    const user = User.findOne({ username })
    if (user) throw new Error('El usuario ya existe')

    const id = crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    User.create({ _id: id, username, password: hashedPassword, email }).save()

    return id
  }

  static async login({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('El usuario no existe')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new Error('Credenciales incorrectas')

    // const { password: _, ...publicUser } = user

    return {
      username: user.username,
      id: user._id
    }
  }
}

class Validation {
  static username(username) {
    if (typeof username !== 'string') throw new Error('El username debe ser un string')
    if (username.length < 4) throw new Error('El username debe tener al menos 4 caracteres')
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('El password debe ser un string')
    if (password.length < 8) throw new Error('El password debe tener al menos 8 caracteres')
  }
}
