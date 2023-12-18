import { Router } from "express";
import globalErrorHandler from "./errors/globalErrorHandler.js";
import {
  createPowerMeterReport,
  generatePowerMeterToken,
  ping,
  switchMeter,
} from "./controllers/PowerMeterController.js";
import requireMeter from "./middleware/requireMeter.js";
import { login } from "./controllers/loginController.js";
import {
  generateBillsForAll,
  getBill,
  getPartialBilling,
} from "./controllers/billingController.js";
import { requireAuth } from "./middleware/requireAuth.js";
import {
  createConsumer,
  getConsumerById,
  getConsumers,
} from "./controllers/consumerController.js";
import { getConsumptionReport } from "./controllers/reportController.js";
import { createCutoff } from "./controllers/cutoffController.js";
import requireEmployee from "./middleware/requireEmployee.js";
import { createEmployee } from "./controllers/employeeController.js";
import { createRate } from "./controllers/rateController.js";

const router = Router();

// Routes that do not require authentication
router.post("/login", login);
router.post("/register/consumer", createConsumer);

// In production, make sure only employees can create other employee accounts
// router.post("/register/employee",requireAuth,requireEmployee, createEmployee);
//
// For now, temporarily use an open employee registration for demo purposes
router.post("/register/employee", createEmployee);

router.post("/meter/get-token", generatePowerMeterToken);

// Routes that can only be accessed by power meters
router.post("/meter/reports", requireMeter, createPowerMeterReport);
router.post("/meter/ping", requireMeter, ping);

// Routes beyond this point require authentication
router.use(requireAuth);

router.get("/billing", getBill);
router.get("/billing/partial", getPartialBilling);
router.post("/billing/generate-for-all", requireEmployee, generateBillsForAll);
router.get("/reports/consumption/:consumerId", getConsumptionReport);

router.post("/cutoffs", requireEmployee, createCutoff);
router.post("/rates", requireEmployee, createRate);
router.get("/consumers", requireEmployee, getConsumers);
router.get("/consumers/:consumerId", requireEmployee, getConsumerById);

router.put("/meter/:meterId/switch", requireEmployee, switchMeter);

// Do not put routes or other middleware beyond this global handler
router.use(globalErrorHandler);

export default router;
