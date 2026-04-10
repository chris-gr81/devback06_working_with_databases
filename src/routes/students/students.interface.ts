export interface CreateStudentDto {
  name: string;
}

export interface AddCourseToStudentDto {
  courseId: number;
}

export interface AddCourseToStudentMongoDto {
  courseId: string;
}
