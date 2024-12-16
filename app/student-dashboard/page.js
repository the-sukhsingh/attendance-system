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

  if (!studentData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-8 text-[var(--text-primary)]">My Attendance</h1>
      <div className="table-container overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full">
          <thead className="table-header bg-[var(--card-background)]">
            <tr>
              <th className="table-cell sticky left-0 z-10">Subject</th>
              <th className="table-cell min-w-[200px]">Dates</th>
              <th className="table-cell sticky right-0 z-10">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {classes && classes.map(cls => (
              <tr key={cls._id} className="table-row">
                <td className="table-cell sticky left-0 bg-[var(--card-background)]">{cls.name}</td>
                <td className="table-cell">
                  <div className="flex gap-2 pb-2 ">
                    {cls && cls.attendance.map((attendd, index) => (
                      <div key={index} className="card min-w-[80px] p-2">
                        <div className="text-sm text-[var(--text-secondary)]">
                          {new Date(attendd.date).toLocaleDateString()}
                        </div>
                        <div className="mt-1 flex justify-center">
                         {
                          attendd.attended?.find((student) => student.studentId === studentData._id) && (
                            <span 
                              key={studentData._id} 
                              className={`rounded-full h-4 w-4 inline-block ${attendd.attended.find(student => student.studentId === studentData._id).present ? 'bg-green-500' : 'bg-red-500'}`}
                            ></span>
                          )
                         }
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="table-cell sticky right-0 bg-[var(--card-background)]">
                  {calculateStudentAttendance(studentData._id, cls.attendance)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function calculateStudentAttendance(studentId, attendance) {
  if (!attendance || attendance.length === 0) return 0;
  const totalDays = attendance.length;
  const presentDays = attendance.reduce((acc, day) => {
    const studentAttendance = day.attended?.find(student => student.studentId === studentId);
    return acc + (studentAttendance?.present ? 1 : 0);
  }, 0);
  return Math.round((presentDays / totalDays) * 100);
}
