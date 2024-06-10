/**
 * Sets up API endpoints
 */

import express from "express";
import { validateReqBody } from "./middlewares.js";
import { receiveExchangeData, getLatestExchangeData } from "./controllers.js";

const router = express.Router();

router.post("/exchange-rate-data", validateReqBody, receiveExchangeData);

router.get("/exchange-rate-data", getLatestExchangeData);

export default router;
