import { createDbConnection } from "../db/dbConfig";
import { IStudentsRepository } from "./IStudentsRepository";
import Student from "../models/Student";

export class StudentsRepository implements IStudentsRepository {
    async createStudent(student: Student): Promise<Student> {
        const dbPromise = createDbConnection();
        const db = await dbPromise;

        let roomToUppercase: string = student.room.toUpperCase();
        let sql = `INSERT INTO students(name, shift, year, room) VALUES ("${student.name}", "${student.shift}", "${student.year}", "${roomToUppercase}")`;

        await db.run(sql)

        const newStudent = await db.get(
            "SELECT * FROM students ORDER BY id DESC LIMIT 1"
        );

        return newStudent as unknown as Student;
    }

    async deleteStudentById(id: string)  {
        const dbPromise = createDbConnection();
        const db = await dbPromise;
        await db.run("DELETE from students WHERE id=?", [id]);
    }
}
