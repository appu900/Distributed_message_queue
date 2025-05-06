import express from "express";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
const router = express.Router();

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// create a new user
router.post("/", async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "User with this email already exists",
      });
    }
    const user = await UserModel.create({ email, password });
    const token = jwt.sign({ userId: user.userId }, "hello world", {
      expiresIn: "10d",
    });
    res.status(201).json({
      error: false,
      message: "user registration sucessfully",
      user: {
        userId: user.userId,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
