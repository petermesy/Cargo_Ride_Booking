"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const Driver_1 = __importDefault(require("../models/Driver"));
const Admins_1 = __importDefault(require("../models/Admins"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, name, phoneNumber } = req.body;
    let Model = role === 'driver' ? Driver_1.default : role === 'admin' ? Admins_1.default : User_1.default;
    try {
        const existingUser = yield Model.findOne({ where: { email } });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield Model.create(Object.assign({ email, password: hashedPassword, name: role !== 'admin' ? name : undefined, phoneNumber: role === 'driver' ? phoneNumber : undefined }, (role === 'driver' ? { status: 'pending' } : {})));
        res.status(201).json({ message: 'User registered' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check Users table
        let user = yield User_1.default.findOne({ where: { email } });
        let role = 'user';
        let found = false;
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            found = true;
        }
        else {
            // Check Drivers table
            user = yield Driver_1.default.findOne({ where: { email } });
            role = 'driver';
            if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
                found = true;
            }
            else {
                // Check Admins table
                user = yield Admins_1.default.findOne({ where: { email } });
                role = 'admin';
                if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
                    found = true;
                }
            }
        }
        if (!found) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // ...existing code...
        const token = jsonwebtoken_1.default.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, id: user.id, role }); // <-- add id here
        // ...existing code...
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
