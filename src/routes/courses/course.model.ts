import mongoose, { InferSchemaType, Schema } from "mongoose";

const courseSchema = new Schema({
  name: { type: String, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  createdAt: { type: Date, default: Date.now },
});

export const CourseModel = mongoose.model("Course", courseSchema);
export type Course = InferSchemaType<typeof CourseModel>;
