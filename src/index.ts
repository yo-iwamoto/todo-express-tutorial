import express from "express";
import * as bodyParser from "body-parser";
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
// import cors = require('cors')

import auth from './controllers/auth'

const app = express();
const env = process.env
const PORT = env.PORT || 5000
const router = express.Router();

app.use((req, res, next) => {
  const allowedOrigins = ["https://leisurely-todo-9ckjnv9h7-you-5805.vercel.app", "https://leisurely-todo.vercel.app", "http://localhost:8080"]
  const origin = req.headers.origin
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Origin', "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Access-Token, Accept")
  res.header("Access-Control-Expose-Headers", "*")
  next()
})

// app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/auth', auth)

app.listen(PORT, () => {
  console.log(`listening on port ${ PORT }`);
});

export default app;
