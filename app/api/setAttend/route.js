import { NextResponse } from "next/server";
import Class from "../models/Classes";
import validUser from "../middleware";
import Student from "../models/Student";
import connectToDatabase from "../db";

export async function POST(request) {
  await connectToDatabase();
  await validUser(request);
  const user = request.user;
  if (!user || user.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { classId, presentArray,studentArray } = await request.json();
  const classData = await Class.findById(classId);

  if (!classData) {
    return NextResponse.json({ message: "Class not found" }, { status: 404 });
  }
  const attended = []
  for(let i=0;i<studentArray.length;i++){
    const student = await Student.findById(studentArray[i]._id);
    if(!student){
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }
    const rollNo = student.rollNo;
    const isPresent = presentArray[rollNo] == 'present' ? true : false;
    attended.push({
      studentId: studentArray[i]._id,
      present: isPresent,
    });
  }

  classData.attendance.push({
    date: new Date(),
    attended,
  });

  await classData.save();
  return NextResponse.json({ class: classData });
}
