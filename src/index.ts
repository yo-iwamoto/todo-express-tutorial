import express from "express";
import * as bodyParser from "body-parser";

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.get(
  "/",
  async (req: express.Request, res: express.Response): Promise<void> => {
    res.send("hello world");
  }
);

app.use("/", router);

app.listen(5000, () => {
  console.log("listening on port 5000");
});

export default app;