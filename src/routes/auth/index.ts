import * as Express from 'express'

const router = Express.Router({ mergeParams: true })

router.post('/register', (req: Express.Request, res: Express.Response) => {
  res.json([
    { message: 'register' }
  ])
})

router.post('/signup', (req: Express.Request, res: Express.Response) => {
  res.send('signup')
})

export default router
