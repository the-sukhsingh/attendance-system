import { NextResponse } from "next/server";
import Class from "../models/Classes";
import Teacher from "../models/Teacher";
import validUser from "../middleware";
import connectToDatabase from "../db";

export async function POST(request) {
    await connectToDatabase();
    await validUser(request);
    const user = request.user;
    if (!user || user.role !== "teacher") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const name = await request.json();
    const newClass = new Class({
        name,
        teacher: request.user._id,
        students: [],
        attendance:[],
    });
    await newClass.save();

    const teacher = await Teacher.findById(user._id);
    teacher.classes.push(newClass._id);
    await teacher.save();

    return NextResponse.json(
        {message: "Class created successfully", class: newClass,status:201}
    );

}