import { HttpException } from "../../db/error/HttpException";
import {
  addCourseToStudentInDb,
  createStudentInDb,
  deleteStudentByIdFromDb,
  getStudentByIdFromDb,
  getStudentsFromDb,
  updateStudentByIdInDb,
} from "./students.db.service";
import {
  AddCourseToStudentDto,
  AddCourseToStudentMongoDto,
  CreateStudentDto,
} from "./students.interface";

export async function getStudents() {
  return await getStudentsFromDb();
}

export async function getStudentsById(studentId: string) {
  if (!studentId) {
    throw new HttpException(400, "Student Id is required");
  }
  const student = await getStudentByIdFromDb(studentId);
  if (!student) {
    throw new HttpException(404, `Student with ID ${studentId} not found`);
  }
  return student;
}

export async function createStudent(studentData: CreateStudentDto) {
  if (!studentData.name) {
    throw new HttpException(400, "Student name is required");
  }
  return await createStudentInDb(studentData);
}

export async function addCourseToStudent(
  studentId: string,
  addCourseToStudentData: AddCourseToStudentMongoDto,
) {
  if (!studentId) {
    throw new HttpException(400, "Student ID is required");
  }
  if (!addCourseToStudentData.courseId) {
    throw new HttpException(400, "Course ID is required");
  }
  try {
    return await addCourseToStudentInDb(studentId, addCourseToStudentData);
  } catch (err: any) {
    throw new HttpException(
      500,
      err?.message ?? "Failed to add student to course",
    );
  }
}

export async function updateStudentById(
  studentId: string,
  studentData: CreateStudentDto,
) {
  if (!studentId) {
    throw new HttpException(400, "Student ID is required");
  }
  if (!studentData.name) {
    throw new HttpException(400, "Student name is required");
  }
  return await updateStudentByIdInDb(studentId, studentData);
}

export async function deleteStudentById(studentId: string) {
  if (!studentId) {
    throw new HttpException(400, "Student ID is required");
  }
  return await deleteStudentByIdFromDb(studentId);
}
