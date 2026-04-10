import mongoose, { InferSchemaType, Schema } from "mongoose";

const studentSchema = new Schema({
  name: { type: String, required: true },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  createdAt: { type: Date, default: Date.now },
});

export const StudentModel = mongoose.model("Student", studentSchema);
export type Student = InferSchemaType<typeof StudentModel>;
