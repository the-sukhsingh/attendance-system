import { useState } from 'react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-96 text-black">
        <div className="overflow-x-hidden relative">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {students.map((student, index) => (
              <div
                key={student.rollNo}
                className="w-full flex-shrink-0"
              >
                <h3 className="text-xl mb-4">{student.name}</h3>
                <div className="flex justify-between items-center mb-2">

                <p>Roll No: {student.rollNo}</p>
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
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={() => handleAttendance('present')}
                  >
                    Present
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => handleAttendance('absent')}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            className="bg-gray-500 text-white p-2 rounded"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            className="bg-gray-500 text-white p-2 rounded"
            onClick={() => setCurrentIndex(Math.min(students.length - 1, currentIndex + 1))}
            disabled={currentIndex === students.length - 1}
          >
            Next
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="bg-gray-500 text-white p-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            onClick={() => onSubmit(attendance)}
            disabled = {
              Object.keys(attendance).length !== students.length
            }
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </div>
  );
}
