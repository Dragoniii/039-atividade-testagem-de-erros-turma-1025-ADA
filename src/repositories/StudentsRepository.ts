import { createDbConnection } from "../db/dbConfig";
import { IStudentsRepository } from "./IStudentsRepository";
import Student from "../models/Student";

export class StudentsRepository implements IStudentsRepository {
    async createStudent(student: Student): Promise<Student> {
        const dbPromise = createDbConnection();
        
        const db = await dbPromise;

        let roomToUppercase: string = student.room.toUpperCase();
        let sql = `INSERT INTO students(name, shift, year, room) VALUES ("${student.name}", "${student.shift}", "${student.year}", "${roomToUppercase}")`;

        await new Promise((resolve, reject) => {
            db.run(sql, (err: any, result: any) => {
                if (!err) {
                    resolve(result)
                }
            })
        })

        const newStudent = await new Promise((resolve, reject) => {
            db.get(
                "SELECT * FROM students ORDER BY id DESC LIMIT 1",
                (err, result) => {
                    if (!err) {
                        resolve(result)
                    }
                }
            )
        })


        return newStudent as Student;
    }

    async deleteStudentById(id: string) {
        const dbPromise = createDbConnection();
        const db = await dbPromise;
        await db.run("DELETE from students WHERE id=?", [id]);
    }
}
