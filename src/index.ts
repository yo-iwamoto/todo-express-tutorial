import express from "express";
import * as bodyParser from "body-parser";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import { connection } from './db/database'
import { MysqlError } from 'mysql'

import auth from './controllers/auth'
import tasks from './controllers/tasks'

const app = express();
const env = process.env
const PORT = env.PORT || 5000
const router = express.Router();

const handleDisconnect = () => {
  connection.connect((err: MysqlError) => {
    if (err) {
      console.log('error when connecting db')
      setTimeout(handleDisconnect, 2000)
    }
  })
  
  connection.on('error', (err: MysqlError) => {
    console.log('db error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect()
    } else {
      throw err
    }
  })
}


app.use((req, res, next) => {
  const allowedOrigins = ["https://leisurely-todo-9ckjnv9h7-you-5805.vercel.app", "https://leisurely-todo.vercel.app", "http://127.0.0.1:8080"]
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  // res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Access-Token, Accept, Access-Control-Allow-Origin")
  res.header("Access-Control-Expose-Headers", "*")
  next()
})

// app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/auth', auth)
app.use('/api/v1/tasks', tasks)

app.listen(PORT, () => {
  console.log(`listening on port ${ PORT }`);
});

export default app;
