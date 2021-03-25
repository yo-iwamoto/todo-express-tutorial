import * as Express from 'express'
import jwt from 'jsonwebtoken'

const router = Express.Router({ mergeParams: true })

const SECRET_KEY = process.env.SECRET_KEY

router.post('/register', (req: Express.Request, res: Express.Response) => {
  res.json([
    { message: 'register' }
  ])
})

router.post('/signup', (req: Express.Request, res: Express.Response) => {
  res.send('signup')
})

export default router
