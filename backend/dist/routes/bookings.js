"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.protect, (0, auth_1.restrictTo)('user'), bookingController_1.createBooking);
router.get('/driver', auth_1.protect, (0, auth_1.restrictTo)('driver'), bookingController_1.getDriverBookings);
exports.default = router;
