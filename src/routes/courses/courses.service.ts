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
import {
  AddStudentToCourseDto,
  AddStudentToCourseMongoDto,
  CreateCourseDto,
} from "./courses.interface";

export async function getCourses() {
  return await getCoursesFromDb();
}

export async function getCourseById(courseId: string) {
  if (!courseId) {
    throw new HttpException(400, "Course Id is required");
  }

  const course = await getCourseByIdFromDb(courseId);

  if (!course) {
    throw new HttpException(404, `Course with ID ${courseId} not found`);
  }
  return course;
}

export async function getStudentsByCourseId(courseId: string) {
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
  courseId: string,
  addStudentToCourseData: AddStudentToCourseMongoDto,
) {
  if (!courseId) {
    throw new HttpException(400, "Course ID is required");
  }
  if (!addStudentToCourseData.studentId) {
    throw new HttpException(400, "Student ID is required");
  }
  try {
    return await addStudentToCourseInDb(courseId, addStudentToCourseData);
  } catch (err: any) {
    throw new HttpException(500, "Failed to add student to course");
  }
}

export async function updateCourseById(
  courseId: string,
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

export async function deleteCourseById(courseId: string) {
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
