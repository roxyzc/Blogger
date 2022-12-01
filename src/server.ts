import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { connectToDatabase } from "./config/connectToDatabase.config";
import { notFound, errorHandler } from "./middlewares/errorHandlers.middleware";
import AuthRoute from "./routes/auth.route";
import "dotenv/config";

const app: Application = express();
connectToDatabase();

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(AuthRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, (): void => {
  console.log(`Listen at port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});
