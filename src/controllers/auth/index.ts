import * as Express from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { MysqlError } from 'mysql'
import { connection } from '../../db/database'

const router = Express.Router({ mergeParams: true })

const SECRET_KEY = process.env.SECRET_KEY
const createUserSql = 'INSERT INTO user VALUE ()'
const selectLastIdSql = 'SELECT id FROM user ORDER BY id ASC LIMIT 1'

interface Payload {
  id: number;
}

router.post('/register', (req: Express.Request, res: Express.Response) => {
  // 最後のUserのidに+1したidでUserを作成し，SQLを1文で済ませる．
  connection.query(createUserSql, (err: MysqlError) => {
    if (err) {
      res.send(500)
    }
  })
  connection.query(selectLastIdSql, (err: MysqlError, results: any) => {
    if (err) {
      res.send(500)
    } else {
      const id: number = results[0].id
      const payload: Payload = { id: id }
      const accessToken = jwt.sign(payload, SECRET_KEY)
      res.setHeader('Access-Token', accessToken)
      res.send(200)
    }
  })
})

const updateUserByIdSql = (id: number, uid: number): string => `UPDATE user SET uid = ${uid} WHERE id = ${id}`

// firebase uidの紐付け
router.post('/sync', (req: Express.Request, res: Express.Response) => {
  const accessToken = req.header('access-token')
  const decoded = jwt.verify(accessToken, SECRET_KEY) as Payload
  const id = decoded.id
  const uid = req.body.uid
  connection.query(updateUserByIdSql(id, uid), (err: MysqlError, results: any) => {
    if (err) {
      res.send(500)
    } else {
      console.log(results)
      res.send(200)
    }
  })
})

export default router
