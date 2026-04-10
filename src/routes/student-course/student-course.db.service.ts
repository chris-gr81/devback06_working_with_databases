import { Types } from "mongoose";
import { StudentCourseModel } from "./student-courses.model";
import { CourseModel } from "../courses/course.model";

export async function addStudentToCourseInDb(
  courseId: string,
  studentId: string,
) {
  if (!courseId) {
    throw new Error("Course ID is required");
  }
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const studentCourse = await StudentCourseModel.create({
    courseId,
    studentId,
  });
  return studentCourse;
}
