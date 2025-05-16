import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, updateStudent } from "../store/studentsSlice";

function CampusEnrollment({ campusId }) {
  const dispatch = useDispatch();
  const { items: allStudents } = useSelector((state) => state.students);
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Filter students who are not enrolled in this campus
  const unenrolledStudents = allStudents.filter(
    (student) => !student.campusId || student.campusId !== campusId
  );

  // Filter students who are enrolled in this campus
  const enrolledStudents = allStudents.filter(
    (student) => student.campusId === campusId
  );

  const handleEnroll = async () => {
    if (selectedStudent) {
      try {
        await dispatch(
          updateStudent({
            id: selectedStudent,
            student: { campusId },
          })
        );
        setSelectedStudent("");
      } catch (error) {
        console.error("Failed to enroll student:", error);
      }
    }
  };

  const handleUnenroll = async (studentId) => {
    try {
      await dispatch(
        updateStudent({
          id: studentId,
          student: { campusId: null },
        })
      );
    } catch (error) {
      console.error("Failed to unenroll student:", error);
    }
  };

  return (
    <div className="campus-enrollment">
      <div className="enrollment-section">
        <h3>Enroll New Student</h3>
        <div className="enroll-form">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select a student to enroll</option>
            {unenrolledStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={handleEnroll}
            disabled={!selectedStudent}
            className="enroll-button"
          >
            Enroll Student
          </button>
        </div>
      </div>

      <div className="enrollment-section">
        <h3>Enrolled Students</h3>
        {enrolledStudents.length === 0 ? (
          <p>No students enrolled in this campus.</p>
        ) : (
          <ul className="enrolled-students-list">
            {enrolledStudents.map((student) => (
              <li key={student.id} className="enrolled-student">
                <span>
                  {student.firstName} {student.lastName}
                </span>
                <button
                  onClick={() => handleUnenroll(student.id)}
                  className="unenroll-button"
                >
                  Unenroll
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CampusEnrollment;
