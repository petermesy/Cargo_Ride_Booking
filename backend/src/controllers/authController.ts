import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Driver from '../models/Driver';
import Admin from '../models/Admins';

export const register = async (req: Request, res: Response) => {
  const { email, password, role, name, phoneNumber } = req.body;
  let Model: any = role === 'driver' ? Driver : role === 'admin' ? Admin : User;

  try {
    const existingUser = await Model.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Model.create({
      email,
      password: hashedPassword,
      name: role !== 'admin' ? name : undefined,
      phoneNumber: role === 'driver' ? phoneNumber : undefined,
      ...(role === 'driver' ? { status: 'pending' } : {}),
    });

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check Users table
    let user = await User.findOne({ where: { email } });
    let role = 'user';
    let found = false;

    if (user && (await bcrypt.compare(password, user.password))) {
      found = true;
    } else {
      // Check Drivers table
      user = await Driver.findOne({ where: { email } });
      role = 'driver';
      if (user && (await bcrypt.compare(password, user.password))) {
        found = true;
      } else {
        // Check Admins table
        user = await Admin.findOne({ where: { email } });
        role = 'admin';
        if (user && (await bcrypt.compare(password, user.password))) {
          found = true;
        }
      }
    }

    if (!found) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

// ...existing code...
const token = jwt.sign({ id: user!.id, role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
res.json({ token, id: user!.id, role }); // <-- add id here
// ...existing code...
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};