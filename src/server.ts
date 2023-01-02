import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { connectToDatabase } from "./config/connectToDatabase.config";
import { notFound, errorHandler } from "./middlewares/errorHandlers.middleware";
import AuthRoute from "./routes/auth.route";
import TokenRoute from "./routes/token.route";
import UserRoute from "./routes/user.route";
import BlogRoute from "./routes/blog.route";
import CommentRoute from "./routes/comment.route";
import "dotenv/config";

const app: Application = express();
connectToDatabase();

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(AuthRoute);
app.use(UserRoute);
app.use(BlogRoute);
app.use(CommentRoute);
app.use(TokenRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, (): void => {
  console.log(`Listen at port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});
