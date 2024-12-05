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
    <div className="p-8">
      <h1 className="text-3xl mb-8">My Attendance</h1>
      <div className="overflow-x-auto max-w-screen">
        <table className="w-full">
          <thead className="relative top-0">
            <tr>
              <th className="text-left p-2 min-w-[120px] sticky left-0 z-10">Subject</th>
              <th className="text-left p-2 min-w-[200px] absolute left-[200px] z-10">Dates</th>
              <th className="text-left p-2 min-w-[150px] sticky right-0 z-10">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {classes && classes.map(cls => (
              <tr key={cls._id}>
                <td className="p-2 min-w-[120px] sticky text-black left-0 bg-white">{cls.name}</td>
                <td className="p-2  overflow-x-auto  min-w-[200px]">
                  <div className="flex gap-2 pb-2">
                    {cls && cls.attendance.map((attendd, index) => (
                      <div key={index} className="flex flex-col items-center min-w-[80px] border rounded p-1">
                        <div className="text-sm">{new Date(attendd.date).toLocaleDateString()}</div>
                        <div className="mt-1">
                         {
                          attendd.attended?.map((student) => {
                            if (student.studentId === studentData._id) {
                              return (
                                <span key={student.studentId} className={`rounded-full h-4 w-4 inline-block ${student.present === true ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              );
                            }
                          })
                         }
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-2 sticky right-0 text-black bg-white">
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
