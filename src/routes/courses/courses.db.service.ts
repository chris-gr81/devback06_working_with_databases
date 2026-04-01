import { Database } from "../../db/database.types";
import { supabaseClient } from "../../db/db";
import { InternalServerError } from "../../db/error/InternalServerError";
import { AddStudentToCourseDto, CreateCourseDto } from "./courses.interface";

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
  courseId: number,
): Promise<Database["public"]["Tables"]["courses"]["Row"] | null> {
  const { data: course, error } = await supabaseClient
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new InternalServerError("while fetching course");
  }

  console.log("Course", course);
  return course;
}

async function getStudentsByCourseIdFromSupabase(
  courseId: number,
): Promise<
  { student: Database["public"]["Tables"]["students"]["Row"] }[] | null
> {
  const { data: students, error } = await supabaseClient
    .from("student_courses")
    .select("student:students(*)")
    .eq("course_id", courseId);

  if (error) {
    throw new InternalServerError("while fetching students by courseId");
  }
  return students;
}

async function addStudentToCourseInSupabase(
  courseId: number,
  addStundentToCourseData: AddStudentToCourseDto,
): Promise<void> {
  const { error } = await supabaseClient.from("student_courses").insert({
    course_id: courseId,
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
  courseId: number,
  courseData: CreateCourseDto,
): Promise<Database["public"]["Tables"]["courses"]["Row"]> {
  const { data: course, error } = await supabaseClient
    .from("courses")
    .update({ name: courseData.name })
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    throw new InternalServerError("while updating course");
  }

  return course;
}

async function deleteCourseByIdFromSupabase(courseId: number): Promise<void> {
  const { error } = await supabaseClient
    .from("courses")
    .delete()
    .eq("id", courseId);
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

export {
  getCoursesFromSupabase as getCoursesFromDb,
  getCourseByIdFromSupabase as getCourseByIdFromDb,
  createCourseInSupabase as createCourseInDb,
  updateCourseByIdInSupabase as updateCourseByIdInDb,
  deleteCourseByIdFromSupabase as deleteCourseByIdFromDb,
  getStudentsByCourseIdFromSupabase as getStudentsByCourseIdFromDb,
  addStudentToCourseInSupabase as addStudentToCourseInDb,
  removeStudentFromCourseInSubabase as reomveStudentFromCourseInDb,
};
