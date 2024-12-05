import { NextResponse } from "next/server";
import Class from "../../models/Classes";
import validUser from "../../middleware";
import connectToDatabase from "../../db";


export async function GET(request,{params}) {
    await connectToDatabase();
    await validUser(request);
    const slug = (await params).id  
    console.log("slug is ",slug);
    const cls = await Class.findById(slug);
    return NextResponse.json(cls);
}