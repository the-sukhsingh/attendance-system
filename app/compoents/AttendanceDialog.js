import { set } from "mongoose";
import { useState } from "react";

export default function AttendanceDialog({ students, onClose, onSubmit, attendanceDate, setAttendanceDate }) {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-[90vw]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mark Attendance</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="overflow-x-hidden relative">
            <div 
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {students.map((student) => (
                <div key={student.rollNo} className="w-full flex-shrink-0 space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                      {student.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Roll No: {student.rollNo}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    {attendance[student.rollNo] ? (
                      attendance[student.rollNo] === 'present' ? (
                        <span className="text-green-500 font-semibold text-lg">Present ✓</span>
                      ) : (
                        <span className="text-red-500 font-semibold text-lg">Absent ✗</span>
                      )
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500">Not marked</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      className="py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                      onClick={() => handleAttendance('present')}
                    >
                      Present
                    </button>
                    <button 
                      className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      onClick={() => handleAttendance('absent')}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Attendance Date
            </label>
            <input 
              type="date" 
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button 
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>
            <button 
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={() => setCurrentIndex(Math.min(students.length - 1, currentIndex + 1))}
              disabled={currentIndex === students.length - 1}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between gap-3">
          <button 
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            onClick={() => onSubmit(attendance)}
            disabled={Object.keys(attendance).length !== students.length}
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
