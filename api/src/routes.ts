import { Router } from "express";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import {
  createPowerMeterReport,
  generatePowerMeterToken,
} from "./controllers/PowerMeterController.js";
import requireMeter from "./middleware/requireMeter.js";
import { login } from "./controllers/loginController.js";

const router = Router();

router.post("/login", login);

router.post("/meter/get-token", generatePowerMeterToken);
router.post("/meter/reports", requireMeter, createPowerMeterReport);

// Do not put routes or other middleware beyond this global handler
router.use(globalErrorHandler);

export default router;
