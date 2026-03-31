import { Router } from "express";
import {
  createStudent,
  deleteStudentById,
  getStudents,
  getStudentsById,
  updateStudentById,
} from "./students.service";

const studentRouter = Router();

studentRouter.get("/", async (req, res, next) => {
  try {
    const students = await getStudents();
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
});

studentRouter.get("/:id", async (req, res, next) => {
  try {
    const student = await getStudentsById(Number(req.params.id));
    res.status(200).json(student);
  } catch (err: unknown) {
    next(err);
  }
});

studentRouter.post("/", async (req, res, next) => {
  try {
    const student = await createStudent(req.body);
    res
      .status(201)
      .header({
        "Content-Location": `http://localhost:3000/api/students/${student.id}`,
      })
      .json({ student });
  } catch (err: unknown) {
    next(err);
  }
});

studentRouter.put("/:id", async (req, res, next) => {
  try {
    const student = await updateStudentById(Number(req.params.id), req.body);
    res.status(200).json({ student });
  } catch (err: unknown) {
    next(err);
  }
});

studentRouter.delete("/:id", async (req, res, next) => {
  try {
    await deleteStudentById(Number(req.params.id));
    res.status(204).send();
  } catch (err: unknown) {
    next(err);
  }
});

export default studentRouter;
