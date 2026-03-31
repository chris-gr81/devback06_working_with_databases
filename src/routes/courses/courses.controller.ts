import { Router } from "express";
import {
  createCourse,
  deleteCourseById,
  getCourseById,
  getCourses,
  updateCourseById,
} from "./courses.service";
import { HttpException } from "../../db/error/HttpException";

const courseRouter = Router();

courseRouter.get("/", async (req, res, next) => {
  console.log("Courses list requested");
  try {
    const courses = await getCourses();
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
});

courseRouter.get("/:id", async (req, res, next) => {
  console.log("Course ID: ", req.params.id);
  try {
    const course = await getCourseById(Number(req.params.id));
    res.status(200).json({ course });
  } catch (err: unknown) {
    next(err);
  }
});

courseRouter.get("/:id/students", async (req, res, next) => {});

courseRouter.post("/", async (req, res, next) => {
  console.log("New course data:", req.body);
  try {
    const course = await createCourse(req.body);

    res
      .status(201)
      .header({
        "Content-Location": "http://loacalhost:3000/api/courses/" + course.id,
      })
      .json({ course });
  } catch (err: unknown) {
    next(err);
  }
});

courseRouter.put("/:id", async (req, res, next) => {
  console.log("Update course ID: ", req.params.id);

  try {
    const course = await updateCourseById(Number(req.params.id), req.body);
    res.status(200).json(course);
  } catch (err: unknown) {
    next(err);
  }
});

courseRouter.delete("/:id", async (req, res, next) => {
  console.log("Delete coures by ID: ", req.params.id);
  try {
    deleteCourseById(Number(req.params.id));
    res.status(204).send();
  } catch (err: unknown) {
    next(err);
  }
});

export default courseRouter;
