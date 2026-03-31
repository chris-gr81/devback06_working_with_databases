import { Database } from "../../db/database.types";
import { supabaseClient } from "../../db/db";
import { InternalServerError } from "../../db/error/InternalServerError";
import { CreateStudentDto } from "./students.interface";

async function getStudentsFromSupabase(): Promise<
  Database["public"]["Tables"]["students"]["Row"][]
> {
  const { data: students, error } = await supabaseClient
    .from("students")
    .select("*");

  if (error) {
    throw new InternalServerError("while fetching students");
  }
  return students;
}

async function getStudentByIdFromSupabase(
  studentId: number,
): Promise<Database["public"]["Tables"]["students"]["Row"] | null> {
  const { data: student, error } = await supabaseClient
    .from("students")
    .select("*")
    .eq("id", studentId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new InternalServerError("while fetching student");
  }
  console.log("Student", student);
  return student;
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
  studentId: number,
  studentData: CreateStudentDto,
): Promise<Database["public"]["Tables"]["students"]["Row"]> {
  const { data: student, error } = await supabaseClient
    .from("students")
    .update({ name: studentData.name })
    .eq("id", studentId)
    .select()
    .single();

  if (error) {
    throw new InternalServerError("while updating student");
  }
  return student;
}

async function deleteStudentByIdFromSupabase(studentId: number): Promise<void> {
  const { error } = await supabaseClient
    .from("students")
    .delete()
    .eq("id", studentId);
  if (error) {
    throw new InternalServerError("while deleting student");
  }
}

export {
  getStudentsFromSupabase as getStudentsFromDb,
  getStudentByIdFromSupabase as getStudentByIdFromDb,
  createStudentInSupabase as createStudentInDb,
  updateStudentByIdInSupabase as updateStudentByIdInDb,
  deleteStudentByIdFromSupabase as deleteStudentByIdFromDb,
};
