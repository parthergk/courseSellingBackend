const express = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");
const JWT_SCREPT = "iloveyouswati"

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsedBody = requiredBody.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ message: "invalid input" });
  }

  const { name, email, password } = req.body;

  const hashedPasssword = await bcrypt.hash(password, 6);

  try {
    await UserModel.create({
      name: name,
      email: email, // Fixed typo: "emial" -> "email"
      password: hashedPasssword,
    });

    res
      .status(200)
      .json({ message: `${name}, you are registered successfully` });
  } catch (error) {
    console.error("Error registering user", error);
    res
      .status(500)
      .json({ message: "Registration failed Internal Server Error" }); // Fixed status code and message
  }
});

userRouter.post("/signin", (req, res) => {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsedBody = requiredBody.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ message: "invalid input" });
  }

  const {email, password} = req.body;

  try {
      const findUser = UserModel.findOne({emal:email});
      if (!findUser) {
        return  res.status(401).json({message: "Invalid email or password"});
      }
      
      const verifyPassword  = bcrypt.compare(password, findUser.password);
      if (!verifyPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: findUser._id.toString()}, JWT_SCREPT);

      res.status(200).json({
        message: "You are logged in successfully",
        token,
      });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/purchases", (req, res) => {});

module.exports = userRouter;
