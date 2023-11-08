import { test, expect, beforeEach, describe, vi } from "vitest";
import { createDbConnection } from "../db/dbConfig";
import Student from "../models/Student";

beforeEach(async () => {
    // abrimos a conexão com o banco
    const dbPromise = createDbConnection();

    // aguarda a conexão
    const db = await dbPromise;

    // deletar todos os eventos
    await db.run("DELETE FROM students");
});

describe("Testes para handler de criação de um evento (createEvent)", async () => {
    test("Testar se é possível criar um evento válido (mock do método", async () => {
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

        const dbPromise = createDbConnection();
        const db = await dbPromise;

        const makeStudent = async (student: Student) => {
            let sql = `INSERT INTO students(name, shift, year, room) VALUES ("${student.name}", "${student.shift}", "${student.year}", "${student.room.toLowerCase()}")`;

            if (student.name && student.shift && student.year && student.room) {
                db.run(sql)
            }
        }

        await makeStudent (student1);

        await makeStudent (student2);

        await makeStudent (student3);

        expect(event).toBeTruthy();
        expect(spy).toHaveBeenCalled();
        spy.mockReset();
    })
})