import { connect } from "mongoose";
import { logger } from "../libraries/Logger.library";

export const connectToDatabase = async () => {
  try {
    await connect(process.env.MONGODB_URL as string, {
      w: "majority",
      retryWrites: true,
      retryReads: true,
    });
    logger.info("Connected to database successfully");
  } catch (error: any) {
    logger.error(error.message);
    process.exit(1);
  }
};
