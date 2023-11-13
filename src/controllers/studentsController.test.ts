import { test, expect, beforeEach, describe, vi } from "vitest";
import { createDbConnection } from "../db/dbConfig";
import Student from "../models/Student";
import createError from "http-errors";
import { Database } from "sqlite3";

beforeEach(async () => {
    const dbPromise = createDbConnection();
    const db = await dbPromise;
    await db.run("DELETE FROM students");
});

type StudentWithoutId = Omit<Student, "id">;

const studentsListHandler = async () => {
    let db: Database = createDbConnection();
    let studentsList: Student[] = [];
    let sql = `SELECT * FROM students`;

    const promise = new Promise((resolve, reject) => {
        db.all(sql, [], (error: Error, rows: Student[]) => {
            if (error) {
                throw createError.InternalServerError("Erro interno do Servidor");
            }
            rows.forEach((row: Student) => {
                studentsList.push(row);
            });
            resolve(studentsList);
        });
    });

    return promise as Promise<Student[]>;
}

const makeStudent = async (data: StudentWithoutId) => {
    const promise = new Promise((resolve) => {
        const db = createDbConnection();
        const { name, room, shift, year } = data;
        const student: StudentWithoutId = {
            name,
            room,
            shift,
            year,
        };

        const roomToUppercase = student.room.toUpperCase();

        const sql = `INSERT INTO students(name, shift, year, room) VALUES ("${student.name}", "${student.shift}", "${student.year}", "${roomToUppercase}")`;

        db.exec(sql, (error) => {
            if (!error) {
                resolve(student);
            }
        });
    });

    await promise;
};

describe("Testes para handler de criação de estudantes", async () => {
    test("Testar se é possível criar 3 estudantes", async () => {
        const student1: Student = {
            id: 11,
            name: "Joel",
            shift: "Tarde",
            year: "1025",
            room: "Concur"
        }

        const student2: Student = {
            id: 22,
            name: "Leonardo",
            shift: "Tarde",
            year: "1025",
            room: "Concur"
        }

        const student3: Student = {
            id: 33,
            name: "Cesar",
            shift: "Tarde",
            year: "1025",
            room: "Concur"
        }

        await makeStudent(student1);
        await makeStudent(student2);
        await makeStudent(student3);

        const students = await studentsListHandler();

        expect(students[0].name).toEqual("Joel")
        expect(students[1].name).toEqual("Leonardo")
        expect(students[2].name).toEqual("Cesar")
        expect(students[0].id).toBeTypeOf("number")
        expect(students[0]).toHaveProperty('id')
        expect(students).toHaveLength(3);
    })
})