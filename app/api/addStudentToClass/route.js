import { NextResponse } from "next/server";
import Class from "../models/Classes";
import Student from "../models/Student";
import connectToDatabase from "../db";
import validUser from "../middleware";

export async function POST(request) {
  await connectToDatabase();
  await validUser(request);
  const user = request.user;

  if (!user || user.role !== "teacher") {
    return NextResponse.json({ message: "Invalid User" });
  }

  const { studentName, studentRoll, allAbsent, classId } = await request.json();
  const classObj = await Class.findById(classId);

  if (!classObj) {
    return NextResponse.json({ message: "Class not found" });
  }

  classObj.students.push({ name: studentName, rollNo: studentRoll });
  
  if(allAbsent) {
    classObj.attendance.forEach((day) => {
      day.attended.push({
        name: studentName,
        rollNo: studentRoll,
        present: false,
      });
    });
  }


  classObj.students.sort((a, b) => a.rollNo - b.rollNo);

  await classObj.save();

  return NextResponse.json({
    message: "Student added to class",
    status: 201,
    class: classObj,
  });
}
