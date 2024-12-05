import { NextResponse } from "next/server";
import Class from "../models/Classes";
import Student from "../models/Student";
import connectToDatabase from "../db";
import validUser from "../middleware"

export async function POST(request) {
    await connectToDatabase();
    await validUser(request);
    const user = request.user;

    if (!user || user.role !== "teacher") {
        return NextResponse.json({ message: "Invalid User" });
    }

    const { studentRoll, classId } = await request.json();
    console.log("studentRoll ",studentRoll);
    console.log("classId ",classId);
    const student = await Student.findOne({ rollNo: studentRoll });
    console.log("student ",student);
    if (!student) {
        return NextResponse.json({ error: "Student not found" });
    }

    const classObj = await Class.findById(classId);
    console.log("classObj ",classObj);
    if (!classObj) {
        return NextResponse.json({ error: "Class not found" });
    }

    classObj.students.push(student._id);
    await classObj.save();

    student.classes.push(classId);
    await student.save();
    return NextResponse.json({ message: "Student added to class",
        status:201,
        class:classObj
    });
}