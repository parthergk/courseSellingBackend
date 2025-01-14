const express = require("express");
const { z } = require("zod");
const {CourseModel, PurchaseModel } = require("../db");

const courseRoute = express.Router();

// Purchase Course
courseRoute.post('/purchase', async (req, res) => {
  const requiredBody = z.object({
    courseId: z.string(),
  });

  const parsedBody = requiredBody.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const userId = req.userId;
  const { courseId } = parsedBody.data;

  try {
    // Check if the user already purchased the course
    const existingPurchase = await PurchaseModel.findOne({ userId, courseId });
    if (existingPurchase) {
      return res.status(409).json({ message: "You have already purchased this course" });
    }

    // Create a new purchase
    await PurchaseModel.create({
      userId,
      courseId,
    });

    res.status(201).json({ message: "You have successfully purchased the course" });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Preview All Courses
courseRoute.get('/preview', async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = courseRoute;
