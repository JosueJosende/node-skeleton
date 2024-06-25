import { SECRET_KEY } from '../config.js'
import jwt from 'jsonwebtoken'

export const accessTokenMiddleware = () => (req, res, next) => {
  const token = req.cookies.access_token
  let data = null

  req.session = { user: null }

  try {
    data = jwt.verify(token, SECRET_KEY)
    req.session.user = data
  } catch {}

  next()
}
