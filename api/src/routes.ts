import { Router } from "express";
import globalErrorHandler from "./errors/globalErrorHandler.js";

const router = Router();

// Do not put routes or other middleware beyond this global handler
router.use(globalErrorHandler);

export default router;
