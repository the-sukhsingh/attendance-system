"use client";
import { useState, useEffect } from "react";
import AttendanceDialog from "@/app/compoents/AttendanceDialog";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ClassPage() {
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const { id } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (classData) {
        document.title = classData.name;
    }
}, [classData])


  const getStudents = async () => {
    const res = await fetch(`/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData.students),
    });
    const data = await res.json();
    setStudents(data);
  };

  const getClass = async () => {
    const res = await fetch(`/api/classes/${id}`);
    const data = await res.json();
    if (data.error) {
      window.alert("Class not found");
      router.push("/");
    } else {
      setClassData(data);
    }
  };

  useEffect(() => {
    if (id) {
      getClass();
    }
  }, [id]);

  useEffect(() => {
    if (classData) {
      getStudents();
    }
  }, [classData]);

  const handleAttendanceSubmit = (attendanceData) => {
    fetch("/api/setAttend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId: id,
        presentArray: attendanceData,
        studentArray: students,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClassData(data.class);
        setShowAttendanceDialog(false);
      });
  };

  // Add state for new student dialog
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", rollNo: "" });

  const handleAddStudent = async () => {
    const res = await fetch(`/api/addStudentToClass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentRoll: newStudent.rollNo,
        classId: id,
        studentName: newStudent.name,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to add student");
    }

    const data = await res.json();

    if (data.error) {
      setNewStudent({ name: "", rollNo: "" });
      setShowAddStudentDialog(false);
      return alert(data.error);
    }
    setClassData(data.class);
    setStudents(data.class.students);
    setNewStudent({ name: "", rollNo: "" });
    setShowAddStudentDialog(false);
    alert(data.message);
    return;
  };

  if (!classData) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-8">{classData.subject}</h1>
      <button
        className="bg-blue-500 text-white p-4 rounded-lg mb-8"
        onClick={() => setShowAttendanceDialog(true)}
      >
        Take Attendance
      </button>

      <button
        className="bg-green-500 text-white p-4 rounded-lg mb-8 ml-4"
        onClick={() => setShowAddStudentDialog(true)}
      >
        Add Student
      </button>

      {/* Add Student Dialog */}
      {showAddStudentDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-black">
            <h2 className="text-xl mb-4">Add New Student</h2>
            <input
              type="text"
              placeholder="Student Name"
              className="border p-2 mb-2 w-full"
              value={newStudent.name}
              autoFocus
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })``
              }
            />
            <input
              type="text"
              placeholder="Roll Number"
              className="border p-2 mb-4 w-full"
              value={newStudent.rollNo}
              onChange={(e) =>
                setNewStudent({ ...newStudent, rollNo: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setShowAddStudentDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddStudent}
                disabled={
                  !newStudent.name ||
                  !newStudent.rollNo ||
                  newStudent.name.length < 3
                }
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex">
        <table>
          <thead>
            <tr className="border">
              <th className="text-left p-2 text-nowrap">Roll No</th>
              <th className="text-left p-2 text-nowrap">Name</th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((student, index) => (
                <tr key={student._id || index}
                  className={`border ${
                    index % 2 === 0 ? "bg-gray-600" : "bg-black"
                  }`}
                >
                  <td className="p-2 w-32">{student.rollNo}</td>
                  <td className="p-2 text-nowrap">{student.name}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="overflow-x-auto dates-scroll">
          <table className="table-fixed vignete-right">
            <thead>
              <tr className="border">
                {classData.attendance?.map((att) => (
                  <th
                    key={att.date}
                    className="text-left p-2 w-24 whitespace-nowrap"
                  >
                    {new Date(att.date).toLocaleDateString()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="border">
              {students.map((student, idx) => (
                <tr key={student._id || idx} className="border">
                  {classData.attendance?.map((att) => (
                    <td
                      key={`${student.rollNo}-${att.date}`}
                      className={ 
                        `p-2 text-center ${
                          idx % 2 === 0 ? "bg-gray-600" : "bg-black"
                        }`
                      }
                    >
                      {att.attended && Array.isArray(att.attended) && (
                        <span
                          className={`rounded-full h-6 w-6 inline-block ${
                            att.attended[idx]?.present === true
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            </tbody>
          </table>
        </div>
        <table className="m-0 border">
          <thead>
            <tr>
              <th className="text-left p-2 text-nowrap border">
                Total Classes
              </th>
              <th className="text-left p-2 text-nowrap border">
                Classes Attended
              </th>
              <th className="text-left p-2 text-nowrap border">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => {
              const totalClasses = classData.attendance?.length || 0;
              const attendedClasses =
                classData.attendance?.reduce((acc, day) => {
                  return acc + (day.attended[idx].present === true ? 1 : 0);
                }, 0) || 0;
              const percentage = totalClasses
                ? Math.round((attendedClasses / totalClasses) * 100)
                : 0;

              return (
                <tr key={student.rollNo || idx}
                  className={`border ${
                    idx % 2 === 0 ? "bg-gray-600" : "bg-black"
                  }`} 
                >
                  <td className="p-2 w-28 text-center border">
                    {totalClasses}
                  </td>
                  <td className="p-2 w-32 text-center border">
                    {attendedClasses}
                  </td>
                  <td className="p-2 w-28 text-center border">{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showAttendanceDialog && (
        <AttendanceDialog
          students={students}
          onClose={() => setShowAttendanceDialog(false)}
          onSubmit={handleAttendanceSubmit}
        />
      )}
    </div>
  );
}

// function calculateAttendance(rollNo, attendance) {
//   if (!attendance || attendance.length === 0) return 0;
//   const totalDays = attendance.length;
//   const presentDays = attendance.reduce((acc, day) => {
//     return acc + (day.data[rollNo] === "present" ? 1 : 0);
//   }, 0);
//   return Math.round((presentDays / totalDays) * 100);
// }
