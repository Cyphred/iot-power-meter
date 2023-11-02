import { Router } from "express";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import { generatePowerMeterToken } from "./controllers/PowerMeterController.js";

const router = Router();

router.post("/meter/get-token", generatePowerMeterToken);

// Do not put routes or other middleware beyond this global handler
router.use(globalErrorHandler);

export default router;
