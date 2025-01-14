const express = require("express");
const { zod } = require("zod");
const bcrypt = require("bcrypt");
const { UserModel } = require("../db");

const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.body({
    name: z.string(),
    email: z.string(),
    password: z.string(),
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

    res.status(200).json({ message: `${name}, you are registered successfully` });
} catch (error) {
    console.error('Error registering user', error);
    res.status(500).json({ message: 'Registration failed Internal Server Error' }); // Fixed status code and message
}

});

userRouter.post("/signin", (req, res) => {});

userRouter.post("/purchases", (req, res) => {});

module.exports = userRouter;
