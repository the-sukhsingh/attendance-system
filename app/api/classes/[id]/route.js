import { NextResponse } from "next/server";
import Class from "../../models/Classes";
import validUser from "../../middleware";
import connectToDatabase from "../../db";


export async function GET(request,{params}) {
    await connectToDatabase();
    await validUser(request);
    const user = request.user;
    if (!user || user.role !== "teacher") {
        return NextResponse.error(new Error("Unauthorized"), 401);
    }
    const slug = (await params).id  
    try{
        const cls = await Class.findById(slug);
        return NextResponse.json(cls);
    }
    catch(e){
        return NextResponse.json({error:e},{status:404});
    }
}