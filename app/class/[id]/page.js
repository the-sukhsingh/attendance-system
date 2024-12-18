"use client";
import { useState, useEffect } from "react";
// Add jsPDF imports at the top
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AttendanceDialog from "@/app/compoents/AttendanceDialog";
import { useParams, useRouter } from "next/navigation";

export default function ClassPage() {
  const router = useRouter();
  const [classData, setClassData] = useState(null);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(formatDate());

  function formatDate(date = new Date()) {
    const year = date.toLocaleString('default', { year: 'numeric' });
    const month = date.toLocaleString('default', { month: '2-digit' });
    const day = date.toLocaleString('default', { day: '2-digit' });
    return [year, month, day].join('-');
  }

  useEffect(() => {
    if (classData) {
      document.title = classData.name;
      setStudents(classData.students);
    }
  }, [classData]);

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
        date: attendanceDate,
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
  const [newStudent, setNewStudent] = useState({name:"", rollNo: "" });

  const handleAddStudent = async () => {
    const res = await fetch(`/api/addStudentToClass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentName: newStudent.name,
        studentRoll: newStudent.rollNo,
        classId: id,
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

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const downloadAttendanceReport = () => {
    const doc = new jsPDF();
    // Add title
    doc.setFontSize(16);
    doc.text(`Attendance Report - ${classData.name}`, 14, 15);
    doc.setFontSize(11);
    
    doc.text(
      `Period: ${
        new Date(classData.attendance[0]?.date).toLocaleDateString('en-GB') || 'N/A'
      } -  ${
        new Date(classData.attendance[classData.attendance.length - 1]?.date).toLocaleDateString('en-GB') || 'N/A'
      }`,
      14,
      25
    )

    doc.text(`Total Classes: ${classData.attendance?.length || 0}`, 14, 35);

    // Prepare table data
    const tableData = students.map((student, idx) => {
      const totalClasses = classData.attendance?.length || 0;
      const attendedClasses = classData.attendance?.reduce(
        (acc, day) => acc + (day.attended[idx].present === true ? 1 : 0),
        0
      ) || 0;
      const percentage = totalClasses ? Math.round((attendedClasses / totalClasses) * 100) : 0;
      const status = getAttendanceStatus(percentage);

      return [
        student.rollNo,
        student.name,
        attendedClasses,
        `${percentage}%`,
        status
      ];
    });

    // Generate PDF table
    autoTable(doc, {
      head: [['Roll No', 'Name', 'Classes Attended', 'Attendance %', 'Status']],
      body: tableData,
      startY: 40,
      headStyles: { fillColor: [41, 128, 185] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 14, doc.autoTable.previous.finalY + 10);


    // Save the PDF
    doc.save(`${classData.name}-attendance-report.pdf`);
  };

  if (!classData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {classData.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Class Management Dashboard
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6 mb-8">
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium 
            transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/50"
            onClick={() => setShowAttendanceDialog(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>Take Attendance</span>
          </button>

          <button
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium 
            transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
            onClick={() => setShowAddStudentDialog(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Student</span>
          </button>

        

          <button
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium 
            transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-purple-500/50"
            onClick={downloadAttendanceReport}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Report</span>
          </button>

        </div>




        {/* Main Content */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="flex">
            {/* Student Info Table */}
            <table className="border-r border-gray-200 dark:border-gray-700">
              <thead>
                <tr>
                  <th className="bg-gray-100 dark:bg-gray-900 text-left p-4 text-gray-600 dark:text-gray-400 font-medium">
                    Roll No
                  </th>
                  <th className="bg-gray-100 dark:bg-gray-900 text-left p-4 text-gray-600 dark:text-gray-400 font-medium">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student._id || index}
                    className={`border-b border-gray-200 dark:border-gray-700 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }`}
                  >
                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {student.rollNo}
                    </td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {student.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Attendance Dates */}
            <div className="overflow-x-auto flex-1">
              <table className="border-r border-gray-200 dark:border-gray-700 w-full">
                <thead>
                  <tr>
                    {classData.attendance?.map((att) => (
                      <th
                        key={att.date}
                        className="bg-gray-100 dark:bg-gray-900 text-left p-4 text-gray-600 dark:text-gray-400 font-medium"
                      >
                        {new Date(att.date).toLocaleDateString("en-GB")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr
                      key={student._id || idx}
                      className={`border-b border-gray-200 dark:border-gray-700 ${
                        idx % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      {classData.attendance?.map((att) => (
                        <td
                          key={`${student.rollNo}-${att.date}`}
                          className="p-4 text-gray-700 dark:text-gray-300"
                        >
                          {att.attended && Array.isArray(att.attended) && (
                            <span
                              className={`inline-flex items-center justify-center h-8 w-8 font-extrabold rounded-full ${
                                att.attended[idx]?.present
                                  ? "bg-green-300/80 dark:bg-green-500/20 text-green-800 dark:text-green-500"
                                  : "bg-red-300/80 dark:bg-red-500/20 text-red-800 dark:text-red-500"
                              }`}
                            >
                              {att.attended[idx]?.present ? "✓" : "✕"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Statistics */}
            <table className="border-r border-gray-200 dark:border-gray-700">
              <thead>
                <tr>
                  <th className="bg-gray-100 dark:bg-gray-900 text-left p-4 text-gray-600 dark:text-gray-400 font-medium">
                    Total
                  </th>
                  <th className="bg-gray-100 dark:bg-gray-900 text-left p-4 text-gray-600 dark:text-gray-400 font-medium">
                    Attended
                  </th>
                  <th className="bg-gray-100 dark:bg-gray-900 text-left p-4 text-gray-600 dark:text-gray-400 font-medium">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => {
                  const totalClasses = classData.attendance?.length || 0;
                  const attendedClasses =
                    classData.attendance?.reduce(
                      (acc, day) =>
                        acc + (day.attended[idx].present === true ? 1 : 0),
                      0
                    ) || 0;
                  const percentage = totalClasses
                    ? Math.round((attendedClasses / totalClasses) * 100)
                    : 0;
                  return (
                    <tr
                      key={student.rollNo || idx}
                      className={`border-b border-gray-200 dark:border-gray-700 ${
                        idx % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-700"
                      }`}
                    >
                      <td className="p-4 text-gray-700 dark:text-gray-300 text-center">
                        {totalClasses}
                      </td>
                      <td className="p-4 text-gray-700 dark:text-gray-300 text-center">
                        {attendedClasses}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2 py-1 rounded ${
                            percentage >= 75
                              ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-500"
                              : percentage >= 60
                              ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500"
                              : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dialogs */}
        {showAddStudentDialog && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="card p-6 w-96 max-w-[90vw]">
              <h2 className="text-xl font-semibold mb-4">Add New Student</h2>

              <input type="text"
              className="input mb-4"
              placeholder="Name"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              } />

              <input
                type="text"
                className="input mb-4"
                placeholder="Roll Number"
                value={newStudent.rollNo}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, rollNo: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => setShowAddStudentDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
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

        {showAttendanceDialog && (
          <AttendanceDialog
            students={students}
            onClose={() => setShowAttendanceDialog(false)}
            onSubmit={handleAttendanceSubmit}
            attendanceDate={attendanceDate}
            setAttendanceDate={setAttendanceDate}
          />
        )}
      </div>
    </div>
  );
}
