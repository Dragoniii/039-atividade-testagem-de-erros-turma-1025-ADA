import { Response, Request, NextFunction } from "express";
import { container, inject, injectable } from "tsyringe";
import { createDbConnection } from "../db/dbConfig";
import { Database } from "sqlite3";
import logger from "../services/logger";
import Student from "../models/Student";
import { CreateStudentUseCase } from "../usecases/CreateStudentUseCase";
import { DeleteStudentUseCase } from "../usecases/DeleteStudentUseCase";

let db: Database = createDbConnection();

const studentsRoot = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(201);
}

const studentsList = (req: Request, res: Response) => {
    let studentsList: Student[] = [];

    let sql = `SELECT * FROM students`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            logger.error(error.message);
            res.send(error.message);
        }
        rows.forEach((row: Student) => { studentsList.push(row) });
        logger.info(req);
        res.send(studentsList);
    }
    );
}

const studentsListHandler = () => {
    let studentsList: Student[] = [];

    let sql = `SELECT * FROM students`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            logger.error(error.message);
        }
        rows.forEach((row: Student) => { studentsList.push(row) });
    }
    );
}

const studentsListByYearAndRoom = (req: Request, res: Response) => {
    logger.info(req);
    let studentsList: Student[] = [];
    let year = req.query.year;
    let room = req.query.room?.toString().toUpperCase();

    let sql = `SELECT * FROM students WHERE year="${year}" AND room="${room}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            rows.forEach((row: Student) => { studentsList.push(row) });
            res.send(studentsList);
        } else {
            res.send("Os parâmetros apresentados não rertonaram resultado.");
        }

    })
}

const studentDetailsByQuery = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }

    }
    );
}

const studentDetailsByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }

    }
    );
}

const addStudent = async (req: Request, res: Response) => {
    const student: Student = req.body
    const createStudentUseCase = container.resolve(CreateStudentUseCase);
    const newStudent = await createStudentUseCase.execute(student);
    return newStudent;
}

const updateStudent = (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let roomToUppercase = student.room.toUpperCase();
    let sql = `UPDATE students SET name="${student.name}", 
                                   shift="${student.shift}", 
                                   year="${student.year}",
                                   room="${roomToUppercase}"
                                   WHERE id="${student.id}"
                                   `;


    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    });
}

const updateStudentBySpecificField = (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let sql = `UPDATE students SET name="${student.name}"
                                   WHERE id="${student.id}"
    `
    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    })
}

const deleteStudentByQuery = async (req: Request, res: Response) => {
    const id = req.query.id as string | undefined;

    if (id === undefined) {
        return res.status(400).json({ error: 'ID parameter is missing or invalid.' });
    }

    const deleteStudentUseCase = container.resolve(DeleteStudentUseCase);
    const newStudent = await deleteStudentUseCase.execute(id);
    return newStudent;
}

const deleteStudentByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `DELETE from students WHERE id="${id}"`;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Deleted");
    })
}

export {
    studentsRoot,
    studentsList,
    studentsListByYearAndRoom,
    studentDetailsByQuery,
    studentDetailsByParams,
    addStudent,
    updateStudent,
    updateStudentBySpecificField,
    deleteStudentByQuery,
    deleteStudentByParams,
    studentsListHandler
};