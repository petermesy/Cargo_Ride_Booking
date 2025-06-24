"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.put('/drivers/:id/approve', auth_1.protect, (0, auth_1.restrictTo)('admin'), adminController_1.approveDriver);
router.post('/vehicles', auth_1.protect, (0, auth_1.restrictTo)('admin'), adminController_1.createVehicle);
exports.default = router;
