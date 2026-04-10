import mongoose, { InferSchemaType, Schema } from "mongoose";

const studentCourseSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  grade: { type: Number, default: 4 },
});

export const StudentCourseModel = mongoose.model(
  "StudentCourse",
  studentCourseSchema,
);

export type StudentCourse = InferSchemaType<typeof StudentCourseModel>;
