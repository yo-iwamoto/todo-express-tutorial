import express from "express";
import * as bodyParser from "body-parser";

import auth from './routes/auth'

const app = express();
const env = process.env
const PORT = env.PORT || 5000

const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/auth', auth)

app.listen(PORT, () => {
  console.log(`listening on port ${ PORT }`);
});

export default app;
