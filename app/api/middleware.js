import jwt from "jsonwebtoken";
import { cookies } from 'next/headers'
import { NextResponse } from "next/server";
// Middleware to validate user token from cookies and set userId
const validUser = async (req, next) => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token').value || null
  // Check if token exists
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 403 });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Set user and userId from decoded token
    req.user = decoded;
    req.userId = decoded._id;
    req.userRole = decoded.role

    next();
  } catch (err) {
    return NextResponse.json({ message: "Invalid token" }, { status: 403 },{error:err});
  }
};

export default validUser;
