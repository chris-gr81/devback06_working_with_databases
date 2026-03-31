import { HttpException } from "../../db/error/HttpException";
import {
  createStudentInDb,
  deleteStudentByIdFromDb,
  getStudentByIdFromDb,
  getStudentsFromDb,
  updateStudentByIdInDb,
} from "./students.db.service";
import { CreateStudentDto } from "./students.interface";

export async function getStudents() {
  return await getStudentsFromDb();
}

export async function getStudentsById(studentId: number) {
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

export async function updateStudentById(
  studentId: number,
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

export async function deleteStudentById(studentId: number) {
  if (!studentId) {
    throw new HttpException(400, "Student ID is required");
  }
  return await deleteStudentByIdFromDb(studentId);
}
