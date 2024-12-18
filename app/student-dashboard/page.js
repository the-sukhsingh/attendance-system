"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [classes, setClasses] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/auth');
      return;
    }

    const fetchData = async () => {
      const res = await fetch("/api/getMyAttend", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      setClasses(data.classes);
      setStudentData(currentUser);
    };

    fetchData();
    
  }, []);

  if (!studentData) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--text-primary)]"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="bg-[var(--card-background)] rounded-lg p-6 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)]">My Attendance</h1>
        <p className="text-[var(--text-secondary)]">Track your attendance across all subjects</p>
      </div>
      
      <div className="bg-[var(--card-background)] rounded-lg p-6 shadow-lg">
        <div className="table-container overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr className="border-b border-[var(--border-color)]">
                <th className="table-cell sticky left-0 z-10 bg-[var(--card-background)] p-4 text-left">Subject</th>
                <th className="table-cell min-w-[200px] p-4 text-left">Dates</th>
                <th className="table-cell sticky right-0 z-10 bg-[var(--card-background)] p-4 text-left">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {classes && classes.map(cls => (
                <tr key={cls._id} className="border-b border-[var(--border-color)] hover:bg-[var(--hover-color)]">
                  <td className="table-cell sticky left-0 bg-[var(--card-background)] p-4 font-medium">{cls.name}</td>
                  <td className="table-cell p-4">
                    <div className="flex gap-3 pb-2 flex-wrap">
                      {cls && cls.attendance.map((attendd, index) => (
                        <div key={index} className="bg-[var(--background)] rounded-lg p-3 shadow-sm">
                          <div className="text-sm font-medium text-[var(--text-secondary)]">
                            {new Date(attendd.date).toLocaleDateString()}
                          </div>
                          <div className="mt-2 flex justify-center">
                           {
                            attendd.attended?.find((student) => student.rollNo === studentData.rollNo) && (
                              <span 
                                key={studentData.rollNo} 
                                className={`rounded-full h-5 w-5 inline-block ${
                                  attendd.attended.find(student => student.rollNo === studentData.rollNo).present 
                                    ? 'bg-green-500 shadow-sm shadow-green-200' 
                                    : 'bg-red-500 shadow-sm shadow-red-200'
                                }`}
                              ></span>
                            )
                           }
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell sticky right-0 bg-[var(--card-background)] p-4">
                    <span className="font-bold text-lg">
                      {calculateStudentAttendance(studentData.rollNo, cls.attendance)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function calculateStudentAttendance(studentId, attendance) {
  if (!attendance || attendance.length === 0) return 0;
  const totalDays = attendance.length;
  const presentDays = attendance.reduce((acc, day) => {
    const studentAttendance = day.attended?.find(student => student.rollNo === studentId);
    return acc + (studentAttendance?.present ? 1 : 0);
  }, 0);
  return Math.round((presentDays / totalDays) * 100);
}
