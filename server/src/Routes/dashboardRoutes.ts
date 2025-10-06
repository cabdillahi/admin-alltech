// src/routes/dashboard.routes.ts

import { Router } from "express";
import { decodeToken } from "../helpers/secure/Jwt";
import { getDashboardOverview } from "../Controllers/dashboardController";

const router = Router();

router.get("/overview",decodeToken, getDashboardOverview);

export default router;
