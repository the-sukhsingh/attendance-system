"use client"
import { useState } from "react";

export default function AttendanceDialog({ students, onClose, onSubmit }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [attendance, setAttendance] = useState({});
  
    const handleAttendance = (status) => {
      setAttendance({
        ...attendance,
        [students[currentIndex].rollNo]: status
      });
      
      if (currentIndex < students.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="card w-96 max-w-[90vw] p-6">
        <div className="overflow-x-hidden relative">
          <div className="flex transition-transform duration-300"
               style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {students.map((student, index) => (
              <div key={student.rollNo} className="w-full flex-shrink-0 space-y-4">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{student.name}</h3>
                <div className="flex justify-between items-center">
                  <p className="text-[var(--text-secondary)]">Roll No: {student.rollNo}</p>
                  <p>{
                  attendance[student.rollNo] ? (
                    attendance[student.rollNo] === 'present' ? (
                      <span className="text-green-500">Present</span>
                    ) : (
                      <span className="text-red-500">Absent</span>
                    )
                  ) : (
                    <span className="text-gray-500">Not marked</span>
                  )
                }</p>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary flex-1" onClick={() => handleAttendance('present')}>
                    Present
                  </button>
                  <button className="btn-secondary flex-1" onClick={() => handleAttendance('absent')}>
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button className="btn-secondary" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}>
            Previous
          </button>
          <button className="btn-secondary" onClick={() => setCurrentIndex(Math.min(students.length - 1, currentIndex + 1))}
                  disabled={currentIndex === students.length - 1}>
            Next
          </button>
        </div>

        <div className="mt-4 flex justify-end gap-2"></div>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSubmit(attendance)}
                  disabled={Object.keys(attendance).length !== students.length}>
            Submit Attendance
          </button>
        </div>
    </div>
  );
}
