import { Types } from "mongoose";
import { Database } from "../../db/database.types";
import { supabaseClient } from "../../db/db";
import { InternalServerError } from "../../db/error/InternalServerError";
import { addStudentToCourseInDb } from "../student-course/student-course.db.service";
import { StudentCourseModel } from "../student-course/student-courses.model";
import { Student, StudentModel } from "./student.model";
import {
  AddCourseToStudentDto,
  AddCourseToStudentMongoDto,
  CreateStudentDto,
} from "./students.interface";

function getFlatSutdent(
  student: Database["public"]["Tables"]["students"]["Row"] & {
    courses: { course: Database["public"]["Tables"]["courses"]["Row"] }[];
  },
): Database["public"]["Tables"]["students"]["Row"] & {
  courses: Database["public"]["Tables"]["courses"]["Row"][];
} {
  return {
    ...student,
    courses: student.courses.map((courseEntry) => courseEntry.course),
  };
}

async function getStudentsFromSupabase(): Promise<
  Database["public"]["Tables"]["students"]["Row"][]
> {
  const { data: students, error } = await supabaseClient
    .from("students")
    .select("*, courses:student_courses(course:courses(*))");

  if (error) {
    throw new InternalServerError("while fetching students");
  }

  if (!students) {
    return [];
  }

  const flatStudents = students.map((student) => {
    return getFlatSutdent(student);
  });

  return flatStudents;
}

async function getStudentByIdFromSupabase(
  studentId: string,
): Promise<Database["public"]["Tables"]["students"]["Row"] | null> {
  const { data: student, error } = await supabaseClient
    .from("students")
    .select("*, courses:student_courses(course:courses(*))")
    .eq("id", Number(studentId))
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new InternalServerError("while fetching student");
  }

  if (!student) {
    return null;
  }
  const flatStudent = getFlatSutdent(student);

  return flatStudent;
}

async function addCourseToStudentInSupabase(
  studentId: string,
  addCourseToStudentData: AddCourseToStudentDto,
): Promise<void> {
  const { error } = await supabaseClient.from("student_courses").insert({
    student_id: Number(studentId),
    course_id: addCourseToStudentData.courseId,
  });

  if (error) {
    console.error("Error adding student to course:", error);
    throw new InternalServerError("while adding course to student");
  }
}

async function createStudentInSupabase(
  studentData: CreateStudentDto,
): Promise<Database["public"]["Tables"]["students"]["Row"]> {
  const { data: student, error } = await supabaseClient
    .from("students")
    .insert({ name: studentData.name })
    .select()
    .single();
  if (error) {
    throw new InternalServerError("while creating student");
  }
  return student;
}

async function updateStudentByIdInSupabase(
  studentId: string,
  studentData: CreateStudentDto,
): Promise<Database["public"]["Tables"]["students"]["Row"]> {
  const { data: student, error } = await supabaseClient
    .from("students")
    .update({ name: studentData.name })
    .eq("id", Number(studentId))
    .select()
    .single();

  if (error) {
    throw new InternalServerError("while updating student");
  }
  return student;
}

async function deleteStudentByIdFromSupabase(studentId: string): Promise<void> {
  const { error } = await supabaseClient
    .from("students")
    .delete()
    .eq("id", Number(studentId));
  if (error) {
    throw new InternalServerError("while deleting student");
  }
}

async function createStudentInMongoDb(
  studentData: CreateStudentDto,
): Promise<Student> {
  const student = new StudentModel({ name: studentData.name });
  return await student.save();
}

async function getStudentsFromMongoDb(): Promise<Student[]> {
  const student = await StudentModel.aggregate(
    buldAggregatePipelineForStudent(),
  );

  if (student.length === 0) {
    throw new Error(`No students found`);
  }
  return student;
}

async function getStudentByIdFromMongoDb(
  studentId: string,
): Promise<Student | null> {
  const student = await StudentModel.aggregate(
    buldAggregatePipelineForStudent(studentId),
  );

  if (student.length === 0) {
    throw new Error(`No student found with ID: ${studentId}`);
  }
  return student[0];
}

async function updateStudentByIdInMongoDb(
  studentId: string,
  studentData: CreateStudentDto,
) {
  return await StudentModel.findByIdAndUpdate(
    studentId,
    { name: studentData.name },
    { returnDocument: "after" },
  ).exec();
}

async function deleteStudentByIdInMongoDb(studentId: string): Promise<void> {
  await StudentModel.findByIdAndDelete(studentId).exec();
}

async function addCourseToStudentInMongoDb(
  studentId: string,
  addCourseToStudentData: AddCourseToStudentMongoDto,
) {
  const studentCourse = await addStudentToCourseInDb(
    addCourseToStudentData.courseId,
    studentId,
  );
  return studentCourse;
}

function buldAggregatePipelineForStudent(studentId?: string) {
  const pipeline = [];

  if (studentId) {
    pipeline.push({
      $match: { _id: new Types.ObjectId(studentId) },
    });
  }

  pipeline.push(
    {
      $lookup: {
        from: "studentcourses",
        localField: "_id",
        foreignField: "studentId",
        as: "result",
      },
    },
    { $unwind: { path: "$result" } },
    {
      $lookup: {
        from: "courses",
        localField: "result.courseId",
        foreignField: "_id",
        as: "courses",
      },
    },
    { $unwind: { path: "$courses" } },
    {
      $group: {
        _id: "_id",
        name: { $first: "$name" },
        createdAt: { $first: "$createdAt" },
        courses: { $push: "$courses" },
      },
    },
  );
  return pipeline;
}

export {
  getStudentsFromMongoDb as getStudentsFromDb,
  getStudentByIdFromMongoDb as getStudentByIdFromDb,
  createStudentInMongoDb as createStudentInDb,
  updateStudentByIdInMongoDb as updateStudentByIdInDb,
  deleteStudentByIdInMongoDb as deleteStudentByIdFromDb,
  addCourseToStudentInMongoDb as addCourseToStudentInDb,
};
