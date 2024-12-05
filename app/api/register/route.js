import { NextResponse } from "next/server";
const bcrypt = require("bcrypt");
import Teacher from "../models/Teacher";
import Student from "../models/Student";
import connectToDatabase from "../db";


export async function POST(request) {
    await connectToDatabase();
    const {name, email, password, role,rollNo} = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    if(role === "teacher"){
        const teacher = new Teacher({
            name,
            email,
            password: hashedPassword,
            classes:[],
        });
        await teacher.save();
        return NextResponse.json({message: "Teacher created successfully"}, {status: 201});
    }
    else if(role === "student"){
        const student = new Student({
            name,
            email,
            rollNo,
            password: hashedPassword,
        });
        await student.save();
        return NextResponse.json({message: "Student created successfully"}, {status: 201});
    }
}

