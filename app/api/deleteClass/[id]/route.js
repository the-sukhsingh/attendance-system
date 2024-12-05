import { NextResponse } from "next/server"; 
import validUser from "../../middleware";
import Teacher from "../../models/Teacher";
import Student from "../../models/Student";
import Class from "../../models/Classes";

export async function DELETE(request,{params}) {
    await validUser(request);
    const user = request.user;
    if (!user || user.role !== "teacher") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const teacherId = user._id;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
        return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }
    const classId = (await params).id  
    console.log("classId is ",classId);
    const cls = await Class.findById(classId);
    if (!cls) {
        return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }
    if (cls.teacher.toString() !== teacherId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const students = await Student.find({ classes: classId });
    teacher.classes = teacher.classes.filter((cls) => cls.toString() !== classId);
    await teacher.save();
    for (const student of students) {
        student.classes = student.classes.filter((cls) => cls.toString() !== classId);
        await student.save();
    }

    await Class.findByIdAndDelete(classId);
    return NextResponse.json({ message: "Class deleted" }, { status: 200 });
}