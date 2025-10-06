"use strict";
// src/routes/dashboard.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Jwt_1 = require("../helpers/secure/Jwt");
const dashboardController_1 = require("../Controllers/dashboardController");
const router = (0, express_1.Router)();
router.get("/overview", Jwt_1.decodeToken, dashboardController_1.getDashboardOverview);
exports.default = router;
