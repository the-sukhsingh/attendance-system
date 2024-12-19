"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [classes, setClasses] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "student") {
      router.push("/auth");
      return;
    }

    const fetchData = async () => {
      const res = await fetch("/api/getMyAttend", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setClasses(data.classes);
      setStudentData(currentUser);
    };

    fetchData();
  }, []);

  if (!studentData)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Welcome, {studentData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Roll No: {studentData.rollNo}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes &&
            classes.map((cls) => {
              const attendancePercentage = calculateStudentAttendance(
                studentData.rollNo,
                cls.attendance
              );
              const getColorClass = (percentage) => {
                if (percentage >= 75) return "bg-green-600";
                if (percentage >= 50) return "bg-yellow-500";
                return "bg-red-500";
              };
              const getTextColorClass = (percentage) => {
                if (percentage >= 75) return "text-green-600";
                if (percentage >= 50) return "text-yellow-600";
                return "text-red-600";
              };

              return (
                <div
                  key={cls._id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-book-open h-5 w-5 text-blue-600"
                      >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {cls.name}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {" "}
                        Code: {cls.classCode}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Attendance Rate
                      </span>
                      <span
                        className={`font-semibold ${getTextColorClass(
                          attendancePercentage
                        )}`}
                      >
                        {attendancePercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className={`${getColorClass(
                          attendancePercentage
                        )} h-2.5 rounded-full transition-all duration-300`}
                        style={{
                          width: `${attendancePercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-user-check h-4 w-4 text-green-600"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <polyline points="16 11 18 13 22 9"></polyline>
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Present
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-green-600">
                          {calculatePresentDays(
                            studentData.rollNo,
                            cls.attendance
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-user-x h-4 w-4 text-red-600"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="17" x2="22" y1="8" y2="13"></line>
                            <line x1="22" x2="17" y1="8" y2="13"></line>
                          </svg>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Absent
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-red-600">
                          {calculateAbsentDays(
                            studentData.rollNo,
                            cls.attendance
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function calculateStudentAttendance(studentId, attendance) {
  if (!attendance || attendance.length === 0) return 0;
  const totalDays = attendance.length;
  const presentDays = attendance.reduce((acc, day) => {
    const studentAttendance = day.attended?.find(
      (student) => student.rollNo === studentId
    );
    return acc + (studentAttendance?.present ? 1 : 0);
  }, 0);
  return Math.round((presentDays / totalDays) * 100);
}

function calculatePresentDays(studentId, attendance) {
  if (!attendance || attendance.length === 0) return 0;
  return attendance.reduce((acc, day) => {
    const studentAttendance = day.attended?.find(
      (student) => student.rollNo === studentId
    );
    return acc + (studentAttendance?.present ? 1 : 0);
  }, 0);
}

function calculateAbsentDays(studentId, attendance) {
  if (!attendance || attendance.length === 0) return 0;
  const presentDays = calculatePresentDays(studentId, attendance);
  return attendance.length - presentDays;
}
