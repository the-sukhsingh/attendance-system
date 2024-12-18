import { NextResponse } from "next/server";
import Student from "../models/Student";
import Class from "../models/Classes";
import validUser from "../middleware";
import connectToDatabase from "../db";

export async function GET(request) {
    await connectToDatabase();
    await validUser(request);
    const user = request.user;
    if (!user || user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const studentId = user._id;
    const student = await Student.findById(studentId);
    if (!student) {
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    const allClasses = await Class.find();

    const classes = allClasses.filter((classItem)=>{
        return classItem.students.find((studentItem)=> studentItem.rollNo === student.rollNo)
    })
    return NextResponse.json({classes}, { status: 200 });
}