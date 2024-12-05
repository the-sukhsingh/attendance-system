import { NextResponse } from "next/server";
import Class from "../models/Classes";
import validUser from "../middleware";
import connectToDatabase from "../db";


export async function GET(request) {
    await connectToDatabase();
    // Validate user before proceeding
    await validUser(request);
    const user = request.user;
    if (!user || user.role !== "teacher") {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const classes = await Class.find({
        teacher: request.user._id,
    });
    return NextResponse.json({classes});
}
