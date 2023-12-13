import { Router } from "express";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import {
  createPowerMeterReport,
  generatePowerMeterToken,
  ping,
} from "./controllers/PowerMeterController.js";
import requireMeter from "./middleware/requireMeter.js";
import { login } from "./controllers/loginController.js";
import { getBill, getPartialBilling } from "./controllers/billingController.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { createConsumer } from "./controllers/consumerController.js";
import { createCutoff } from "./controllers/cutoffController.js";
import requireEmployee from "./middleware/requireEmployee.js";

const router = Router();

// Routes that do not require authentication
router.post("/login", login);
router.post("/register/consumer", createConsumer);
router.post("/meter/get-token", generatePowerMeterToken);

// Routes that can only be accessed by power meters
router.post("/meter/reports", requireMeter, createPowerMeterReport);
router.post("/meter/ping", requireMeter, ping);

// Routes beyond this point require authentication
router.use(requireAuth);

router.get("/billing", getBill);
router.get("/billing/partial", getPartialBilling);
router.post("/cutoff", requireEmployee, createCutoff);

// Do not put routes or other middleware beyond this global handler
router.use(globalErrorHandler);

export default router;
