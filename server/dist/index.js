"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserRouter_1 = __importDefault(require("./Routes/UserRouter"));
const dashboardRoutes_1 = __importDefault(require("./Routes/dashboardRoutes"));
const ProductRoutes_1 = __importDefault(require("./Routes/ProductRoutes"));
const ProductSectionRoutes_1 = __importDefault(require("./Routes/ProductSectionRoutes"));
const CategoryRoutes_1 = __importDefault(require("./Routes/CategoryRoutes"));
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "*", // WARNING: for development only
    credentials: true,
}));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || (origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
//  midmponts
app.use('/api/users', UserRouter_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/products', ProductRoutes_1.default);
app.use('/api/productSection', ProductSectionRoutes_1.default);
app.use('/api/category', CategoryRoutes_1.default);
// Catch-all route for undefined routes (404 handler)
app.get("/", (req, res) => {
    res.send("Hello World");
});
// Catch-all 404 handler
app.all("*", (req, res) => {
    res.status(404).json({
        message: "API Not Found",
        status: 404,
    });
});
app.listen(port, () => console.log(`🚀 Server is running on port ${port}`));
