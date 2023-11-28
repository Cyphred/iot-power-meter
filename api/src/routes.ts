import { Router } from "express";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import {
  createPowerMeterReport,
  generatePowerMeterToken,
} from "./controllers/PowerMeterController.js";
import requireMeter from "./middleware/requireMeter.js";
import { login } from "./controllers/loginController.js";
import { getBill, getPartialBilling } from "./controllers/billingController.js";
import { requireAuth } from "./middleware/requireAuth.js";

const router = Router();

// Routes that do not require authentication
router.post("/login", login);
router.post("/meter/get-token", generatePowerMeterToken);

// Routes that can only be accessed by power meters
router.post("/meter/reports", requireMeter, createPowerMeterReport);

// Routes beyond this point require authentication
router.use(requireAuth);

router.get("/billing", getBill);
router.get("/billing/partial", getPartialBilling);

// Do not put routes or other middleware beyond this global handler
router.use(globalErrorHandler);

export default router;
