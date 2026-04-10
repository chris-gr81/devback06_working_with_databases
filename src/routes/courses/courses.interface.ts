export interface CreateCourseDto {
  name: string;
}

export interface AddStudentToCourseDto {
  studentId: number;
}

export interface AddStudentToCourseMongoDto {
  studentId: string;
}
