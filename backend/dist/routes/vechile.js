"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vechileController_1 = require("../controllers/vechileController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/nearby', auth_1.protect, (0, auth_1.restrictTo)('user'), vechileController_1.getNearbyVehicles);
exports.default = router;
