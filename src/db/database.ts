import { MysqlError } from 'mysql'
const mysql = require('mysql')

const env = process.env
const production: boolean = env.NODE_ENV === 'production'

export const connection = mysql.createConnection({
  host: production ? env.DB_HOST : 'localhost',
  user: production ? env.DB_USER : 'todo_app',
  password: production ? env.DB_PASS : '',
  database: production ? env.DB_DATABASE : 'todo_app'
})
