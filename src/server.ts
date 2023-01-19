import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { connectToDatabase } from "./config/connectToDatabase.config";
import { notFound, errorHandler } from "./middlewares/errorHandlers.middleware";
import cookieParser from "cookie-parser";
import passport from "passport";
import { configPassport } from "./config/passport.config";
import AuthRoute from "./routes/auth.route";
import TokenRoute from "./routes/token.route";
import UserRoute from "./routes/user.route";
import BlogRoute from "./routes/blog.route";
import CommentRoute from "./routes/comment.route";
import GoogleRoute from "./routes/google.route";
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

const app: Application = express();
connectToDatabase();
configPassport(passport);

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      autoRemove: "native",
      ttl: 9 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development" ? false : true, // jika menggunakan http false jika https true
      maxAge: 1440 * 60 * 1000,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(AuthRoute);
app.use(GoogleRoute);
app.use(UserRoute);
app.use(BlogRoute);
app.use(CommentRoute);
app.use(TokenRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT as string, (): void => {
  console.log(`Listen at port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});
