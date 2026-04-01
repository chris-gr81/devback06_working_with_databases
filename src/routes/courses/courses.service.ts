import { HttpException } from "../../db/error/HttpException";
import {
  createCourseInDb,
  deleteCourseByIdFromDb,
  getCourseByIdFromDb,
  getCoursesFromDb,
  updateCourseByIdInDb,
  getStudentsByCourseIdFromDb,
  addStudentToCourseInDb,
  reomveStudentFromCourseInDb,
} from "./courses.db.service";
import { AddStudentToCourseDto, CreateCourseDto } from "./courses.interface";

export async function getCourses() {
  return await getCoursesFromDb();
}

export async function getCourseById(courseId: number) {
  if (!courseId) {
    throw new HttpException(400, "Course Id is required");
  }

  const course = await getCourseByIdFromDb(courseId);

  if (!course) {
    throw new HttpException(404, `Course with ID ${courseId} not found`);
  }
  return course;
}

export async function getStudentsByCourseId(courseId: number) {
  if (!courseId) {
    throw new HttpException(400, "Course Id is required");
  }
  return await getStudentsByCourseIdFromDb(courseId);
}

export async function createCourse(courseData: CreateCourseDto) {
  if (!courseData.name) {
    throw new HttpException(400, "Course name is required");
  }

  return await createCourseInDb(courseData);
}

export async function addStudentToCourse(
  courseId: number,
  addStudentToCourseData: AddStudentToCourseDto,
) {
  if (!courseId) {
    throw new HttpException(400, "Course ID is required");
  }
  if (!addStudentToCourseData.studentId) {
    throw new HttpException(400, "Student ID is required");
  }
  return await addStudentToCourseInDb(courseId, addStudentToCourseData);
}

export async function updateCourseById(
  courseId: number,
  courseData: CreateCourseDto,
) {
  if (!courseId) {
    throw new HttpException(400, "Course ID is required");
  }
  if (!courseData.name) {
    throw new HttpException(400, "Course name is required");
  }

  return await updateCourseByIdInDb(courseId, courseData);
}

export async function deleteCourseById(courseId: number) {
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  return await deleteCourseByIdFromDb(courseId);
}

export async function removeStudentFromCourse(
  courseId: number,
  studentId: number,
) {
  if (!courseId) {
    throw new HttpException(400, "Course ID is required");
  }
  if (!studentId) {
    throw new HttpException(400, "Student ID is required");
  }
  return await reomveStudentFromCourseInDb(courseId, studentId);
}
