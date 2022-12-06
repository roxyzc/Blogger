import { Router } from "express";
import { refreshAccessTokenOrRefreshToken } from "../controllers/token.controller";
import { checkExpired } from "../middlewares/verifyToken.middleware";

const route: Router = Router();

route.get("/api/refreshToken", checkExpired, refreshAccessTokenOrRefreshToken);

export default route;
