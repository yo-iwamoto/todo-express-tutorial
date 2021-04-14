import * as Express from 'express'
import { MysqlError } from 'mysql'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { connection } from '../../db/database'
import { Payload, UserRecord, TaskRecord } from '../../types/index'

const router = Express.Router({ mergeParams: true })

const env = process.env
const SECRET_KEY = env.SECRET_KEY

interface CreateTaskParams {
  name: string;
}

// create
router.post('/', (req: Express.Request, res: Express.Response) => {
  const params = req.body as CreateTaskParams
  const accessToken = req.header('access-token')
  const decoded = jwt.verify(accessToken, SECRET_KEY) as Payload
  const user_id = decoded.id
  // user_idとnameを指定してtaskを作成
  connection.query(`INSERT INTO task (user_id, name) VALUE (${user_id}, "${params.name}")`, (err: MysqlError) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.sendStatus(200)
    }
  })
})

// index
router.get('/', (req: Express.Request, res: Express.Response) => {
  const accessToken = req.header('access-token')
  const decoded = jwt.verify(accessToken, SECRET_KEY) as Payload
  const user_id = decoded.id
  // user_idでtaskをINNER JOIN，全件取得
  connection.query(`SELECT task.id, name, status FROM task INNER JOIN user ON task.user_id = user.id WHERE user.id = ${user_id}`, (err: MysqlError, results: TaskRecord[]) => {
    if (err) {
      res.status(500).send(err)
    } else {
      if (results.length === 0) {
        res.send('empty')
      } else {
        res.send({ tasks: results })
      }
    }
  })
})

// update
router.patch('/:id', (req: Express.Request, res: Express.Response) => {
  const accessToken = req.header('access-token')
  if (!accessToken) {
    res.status(500).send('unauthorized')
  } else {
    const id = Number(req.params.id)
    const status = req.body.status as number
    const decoded = jwt.verify(accessToken, SECRET_KEY) as Payload
    const user_id = decoded.id
    // idでtaskを特定，statusを更新
    connection.query(`UPDATE task SET status = ${status} WHERE id = ${id}`, (err: MysqlError, results: TaskRecord[]) => {
      if (err) {
        res.status(500).send(err)
      } else {
        // user_idからtaskをINNER JOIN，全件取得
        connection.query(`SELECT task.id, name, status FROM task INNER JOIN user ON task.user_id = user.id WHERE user.id = ${user_id}`)
        res.sendStatus(200)
      }
    })
  }
})

// delete
router.delete('/:id', (req: Express.Request, res: Express.Response) => {
  if (!req.header('access-token')) {
    res.status(500).send('unauthorized')
  } else {
    const id = Number(req.params.id)
    // idでtaskを特定，削除
    connection.query(`DELETE FROM task WHERE id = ${id}`, (err: MysqlError, results: TaskRecord[]) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.sendStatus(200)
      }
    })
  }
})

export default router
