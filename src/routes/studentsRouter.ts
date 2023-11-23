import { Router } from "express";
import {
    studentsList,
    studentsListByYearAndRoom,
    studentDetailsByQuery,
    studentDetailsByParams,
    addStudent,
    updateStudent,
    deleteStudentByQuery,
    deleteStudentByParams,
    updateStudentBySpecificField
} from "../controllers/studentsController";


const studentsRouter = Router();

studentsRouter.get("/", studentsList);
studentsRouter.get("/studentsListByYearAndRoom", studentsListByYearAndRoom);
studentsRouter.get("/studentDetails/", studentDetailsByQuery);
studentsRouter.get("/:id", studentDetailsByParams);

studentsRouter.post("/addStudent", addStudent);

studentsRouter.put("/updateStudent", updateStudent);
studentsRouter.patch("/updateStudentBySpecificField", updateStudentBySpecificField);

studentsRouter.delete("/deleteStudent", deleteStudentByQuery);
studentsRouter.delete("/:id", deleteStudentByParams);

export default studentsRouter;