"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driverController_1 = require("../controllers/driverController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.put('/status', auth_1.protect, (0, auth_1.restrictTo)('driver'), driverController_1.updateStatus);
exports.default = router;
