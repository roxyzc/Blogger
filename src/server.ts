import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";

const app: Application = express();

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

app.listen(process.env.PORT as string, (): void => {
  console.log(`Listen at port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});
