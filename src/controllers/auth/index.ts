import * as Express from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { MysqlError } from 'mysql'
import { connection } from '../../db/database'
import { Payload, UserRecord } from '../../types/index'

const router = Express.Router({ mergeParams: true })

const env = process.env
const SECRET_KEY = env.SECRET_KEY
const createUserSql = 'INSERT INTO user VALUE ()'
const selectLastIdSql = 'SELECT id FROM user ORDER BY id ASC LIMIT 1'

router.post('/register', (req: Express.Request, res: Express.Response) => {
  // 最後のUserのidに+1したidでUserを作成し，SQLを1文で済ませる．
  connection.query(createUserSql, (err: MysqlError) => {
    if (err) {
      res.status(500).send(err)
    }
  })
  connection.query(selectLastIdSql, (err: MysqlError, results: UserRecord[]) => {
    if (err) {
      res.sendStatus(500)
    } else {
      const id: number = results[0].id
      const payload: Payload = { id: id }
      const accessToken = jwt.sign(payload, SECRET_KEY)
      res.setHeader('Access-Token', accessToken)
      res.sendStatus(200)
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
      res.status(500).send(err)
    } else {
      console.log(results)
      res.sendStatus(200)
    }
  })
})

const findUserByIdSql = (id: number): string => `SELECT * FROM user WHERE id = ${id}`

router.post('/auto_login', (req: Express.Request, res: Express.Response) => {
  const accessToken = req.header('access-token')
  const decoded = jwt.verify(accessToken, SECRET_KEY) as Payload
  const id = decoded.id
  if (id) {
    connection.query(findUserByIdSql(id), (err: MysqlError, results: UserRecord) => {
      if (err) {
        res.status(500).send(err)
      } else {
        // このユーザーが所有するtodoItemsを返す
        res.sendStatus(200)
      }
    })
  } else {
    res.sendStatus(500)
  }
})

const findUserByUidSql = (uid: number): string => `SELECT * FROM user WHERE uid = ${uid}`
// ログアウトしてlocalStorageのデータを削除後firebaseからログインしてuidを載せてきた場合
router.post('/login', (req: Express.Request, res: Express.Response) => {
  const uid = req.body.uid
  connection.query(findUserByUidSql(uid), (err: MysqlError, results: UserRecord) => {
    if (err) {
      res.status(500).send(err)
    } else {
      // ユーザーが所有するtodoItemを返す
      res.sendStatus(200)
    }
  })
})

export default router
