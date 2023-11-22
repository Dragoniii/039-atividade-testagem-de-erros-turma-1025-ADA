import Student from "../models/Student";

export interface IStudentsRepository {
    createStudent: (data: Student) => Promise<Student>;
    deleteStudentById: (id: string) => Promise<void>;
}
