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
  const { classId, presentArray,studentArray,date } = await request.json();
  const classData = await Class.findById(classId);

  if (!classData) {
    return NextResponse.json({ message: "Class not found" }, { status: 404 });
  }
  const attended = []
  for(let i=0;i<studentArray.length;i++){
    const {name,rollNo} = studentArray[i];
    const isPresent = presentArray[rollNo] == 'present' ? true : false;
    attended.push({
     name,
     rollNo,
     present:isPresent
    });
  }

  classData.attendance.push({
    date: date,
    attended,
  });

  classData.attendance.sort((a, b) => new Date(a.date) - new Date(b.date));

  await classData.save();
  return NextResponse.json({ class: classData });
}
