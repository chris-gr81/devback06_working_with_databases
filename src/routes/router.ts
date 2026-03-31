import { Router } from "express";
import studentRouter from "./students/students.controller";
import courseRouter from "./courses/courses.controller";

const router = Router();

router.use("/students", studentRouter);
router.use("/courses", courseRouter);

export default router;
