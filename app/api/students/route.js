import { NextResponse } from "next/server";
import validUser from "../middleware";
import Student from "../models/Student";

export async function POST(request) {
  await validUser(request);
  const user = request.user;
  if (!user || user.role !== "teacher") {
    return NextResponse.error(new Error("Unauthorized"), 401);
  }

  const studentIDArray = await request.json();
  const students = await Student.find({ _id: { $in: studentIDArray } });
  return NextResponse.json(students);
}
