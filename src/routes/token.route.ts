import { Router } from "express";
import { checkExpired } from "../middlewares/verifyToken.middleware";

const route: Router = Router();

route.get("/api/refreshToken", checkExpired);

export default route;
