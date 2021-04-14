const mysql = require('mysql')

const env = process.env
const production = env.NODE_ENV === 'production'

const connection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_DATABASE
})

connection.query('CREATE TABLE user (id int auto_increment primary key not null, uid varchar(200) not null, created_at datetime default current_timestamp, updated_at timestamp default current_timestamp on update current_timestamp)',
  (err, results) => {
  console.log(err)
  console.log(results)
})

connection.query('CREATE TABLE tasks (id int auto_increment primary key not null, user_id int, name varchar(200) not null, status int default 0 not null, constraint fk_user_id foreign key (user_id) references user (id) on delete restrict on update restrict)')
