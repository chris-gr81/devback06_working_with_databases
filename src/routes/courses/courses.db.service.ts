import { Types } from "mongoose";
import { Database } from "../../db/database.types";
import { supabaseClient } from "../../db/db";
import { InternalServerError } from "../../db/error/InternalServerError";
import { addStudentToCourseInDb } from "../student-course/student-course.db.service";
import { Student, StudentModel } from "../students/student.model";
import { Course, CourseModel } from "./course.model";
import {
  AddStudentToCourseDto,
  AddStudentToCourseMongoDto,
  CreateCourseDto,
} from "./courses.interface";

async function getCoursesFromSupabase(): Promise<
  Database["public"]["Tables"]["courses"]["Row"][]
> {
  const { data: courses, error } = await supabaseClient
    .from("courses")
    .select("*");

  if (error) {
    throw new InternalServerError("while fetching courses");
  }

  return courses;
}

async function getCourseByIdFromSupabase(
  courseId: string,
): Promise<Database["public"]["Tables"]["courses"]["Row"] | null> {
  const { data: course, error } = await supabaseClient
    .from("courses")
    .select("*, students:student_courses(student:students(*))")
    .eq("id", Number(courseId))
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new InternalServerError("while fetching course");
  }

  console.log("Course", course);

  if (!course) {
    return null;
  }

  const flatCourse = {
    ...course,
    students: course.students.map((studentEntry) => {
      return studentEntry.student;
    }),
  };

  return flatCourse;
}

async function getStudentsByCourseIdFromSupabase(
  courseId: string,
): Promise<
  { student: Database["public"]["Tables"]["students"]["Row"] }[] | null
> {
  const { data: students, error } = await supabaseClient
    .from("student_courses")
    .select("student:students(*)")
    .eq("course_id", Number(courseId));

  if (error) {
    throw new InternalServerError("while fetching students by courseId");
  }
  return students;
}

async function addStudentToCourseInSupabase(
  courseId: string,
  addStundentToCourseData: AddStudentToCourseDto,
): Promise<void> {
  const { error } = await supabaseClient.from("student_courses").insert({
    course_id: Number(courseId),
    student_id: addStundentToCourseData.studentId,
  });

  if (error) {
    console.error("Error adding student to course:", error);
    throw new InternalServerError("while updating student_courses");
  }
}

async function createCourseInSupabase(
  courseData: CreateCourseDto,
): Promise<Database["public"]["Tables"]["courses"]["Row"]> {
  const { data: course, error } = await supabaseClient
    .from("courses")
    .insert({ name: courseData.name })
    .select()
    .single();

  if (error) {
    throw new InternalServerError("while creating course");
  }

  return course;
}

async function updateCourseByIdInSupabase(
  courseId: string,
  courseData: CreateCourseDto,
): Promise<Database["public"]["Tables"]["courses"]["Row"]> {
  const { data: course, error } = await supabaseClient
    .from("courses")
    .update({ name: courseData.name })
    .eq("id", Number(courseId))
    .select()
    .single();

  if (error) {
    throw new InternalServerError("while updating course");
  }

  return course;
}

async function deleteCourseByIdFromSupabase(courseId: string): Promise<void> {
  const { error } = await supabaseClient
    .from("courses")
    .delete()
    .eq("id", Number(courseId));
  if (error) {
    throw new InternalServerError("while deleting course");
  }
}

async function removeStudentFromCourseInSubabase(
  courseId: number,
  studentId: number,
): Promise<void> {
  const { error } = await supabaseClient
    .from("student_courses")
    .delete()
    .eq("course_id", courseId)
    .eq("student_id", studentId);

  if (error) {
    throw new InternalServerError("while removing student from course");
  }
}

async function createCourseInMongoDb(
  courseData: CreateCourseDto,
): Promise<Course> {
  const course = new CourseModel({ name: courseData.name });
  return await course.save();
}

async function getCoursesFromMongoDb(): Promise<Course[]> {
  return await CourseModel.find().populate("students").exec();
}

async function getCourseByIdFromMongoDb(
  courseId: string,
): Promise<Course | null> {
  const course = await CourseModel.aggregate()
    .match({
      _id: new Types.ObjectId(courseId),
    })
    .lookup({
      from: "studentcourses",
      localField: "_id",
      foreignField: "courseId",
      as: "result",
    })
    .unwind({ path: "$result" })
    .lookup({
      from: "students",
      localField: "result.studentId",
      foreignField: "_id",
      as: "students",
    })
    .unwind({ path: "$students" })
    .group({
      _id: "$_id",
      name: { $first: "$name" },
      createdAt: { $first: "createdAt" },
      students: { $push: "$students" },
    });

  console.log("Fetched students for course:", courseId, course);
  if (course.length === 0) {
    throw new Error(`No course found with ID: ${courseId} `);
  }
  return course[0];
}

async function updateCourseByIdInMongoDb(
  courseId: string,
  courseData: CreateCourseDto,
): Promise<Course | null> {
  const course = await CourseModel.findByIdAndUpdate(
    courseId,
    {
      name: courseData.name,
    },
    { returnDocument: "after" },
  ).exec();
  return course;
}

async function deleteCourseByIdInMongoDb(courseId: string): Promise<void> {
  await CourseModel.findByIdAndDelete(courseId).exec();
}

async function getStudentByCourseIdFromMongoDb(
  courseId: string,
): Promise<Student[] | null> {
  const students = await StudentModel.find({
    courses: { $in: [courseId] },
  }).exec();
  return students;
}

async function addStudentToCourseInMongoDb(
  courseId: string,
  addStudentToCourseData: AddStudentToCourseMongoDto,
) {
  const studentCourse = await addStudentToCourseInDb(
    courseId,
    addStudentToCourseData.studentId,
  );

  return studentCourse;
}

export {
  getCoursesFromMongoDb as getCoursesFromDb,
  getCourseByIdFromMongoDb as getCourseByIdFromDb,
  createCourseInMongoDb as createCourseInDb,
  updateCourseByIdInMongoDb as updateCourseByIdInDb,
  deleteCourseByIdInMongoDb as deleteCourseByIdFromDb,
  getStudentByCourseIdFromMongoDb as getStudentsByCourseIdFromDb,
  addStudentToCourseInMongoDb as addStudentToCourseInDb,
  removeStudentFromCourseInSubabase as reomveStudentFromCourseInDb,
};
