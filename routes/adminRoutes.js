const express = require("express");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AdminModel, CourseModel } = require("../db");

const adminRoute = express.Router();

// Admin Signup
adminRoute.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const parsedBody = requiredBody.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { name, email, password } = parsedBody.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await AdminModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: `${name}, you have registered successfully` });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Registration failed: Internal Server Error" });
  }
});

// Admin Sign-In
adminRoute.post("/signin", async (req, res) => {
  const requiredBody = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const parsedBody = requiredBody.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { email, password } = parsedBody.data;

  try {
    const findAdmin = await AdminModel.findOne({ email });
    if (!findAdmin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const verifyPassword = await bcrypt.compare(password, findAdmin.password);
    if (!verifyPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: findAdmin._id }, process.env.JWT_SECRET_ADMIN, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "You are logged in successfully",
      token,
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add Course
adminRoute.post("/course", async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await CourseModel.create({
      title,
      description,
      price,
      imageUrl,
      creatorId: adminId,
    });

    res.status(201).json({
      message: "Your course has been added successfully",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Course
adminRoute.put("/course", async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, imageUrl, courseId } = req.body;

  try {
    const course = await CourseModel.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      { title, description, price, imageUrl },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found or unauthorized" });
    }

    res.status(200).json({
      message: "Your course has been updated successfully",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Courses
adminRoute.get("/course/all", async (req, res) => {
  const adminId = req.adminId;

  try {
    const courses = await CourseModel.find({ creatorId: adminId });
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = adminRoute;
