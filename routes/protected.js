import { Router } from 'express'

export const protectedRoute = Router()

protectedRoute.get('/', (req, res) => {
  const { user } = req.session
  if (!user) return res.status(403).json({ error: 'No autorizado' })

  res.json({ message: 'Información sensible', user })
})
