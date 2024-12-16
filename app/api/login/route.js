import { NextResponse } from "next/server";
import Teacher from "../models/Teacher";
import Student from "../models/Student";
import connectToDatabase from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(request) {
    await connectToDatabase();
    const { email, password } = await request.json();
    const user = await Teacher.findOne({ email }) || await Student.findOne({ email }) || null;
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return NextResponse.json({ message: "Invalid password" }, { status: 400 });
    }
    const token = jwt.sign({ _id: user._id,role: user.role }, process.env.JWT_SECRET);
    return NextResponse.json({
        status: 200,
        user,
    }, {
        headers: {
            'Set-Cookie': `token=${token}; Path=/; HttpOnly`
        }
    })
}