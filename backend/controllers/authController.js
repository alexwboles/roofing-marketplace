import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "../models/User.js";
import { requireFields } from "../utils/validators.js";

export async function login(req, res, next) {
  try {
    requireFields(req.body, ["email", "password"]);
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

export async function registerContractor(req, res, next) {
  try {
    requireFields(req.body, ["email", "password"]);
    const { email, password } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password_hash: hash, role: "contractor" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}
