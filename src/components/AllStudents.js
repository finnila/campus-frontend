import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchStudents, deleteStudent } from "../store/studentsSlice";

function AllStudents() {
  const dispatch = useDispatch();
  const {
    items: students,
    status,
    error,
  } = useSelector((state) => state.students);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchStudents());
    }
  }, [status, dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await dispatch(deleteStudent(id));
      await dispatch(fetchStudents());
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="all-students">
      <h1>All Students</h1>
      <Link to="/students/add" className="add-button">
        Add New Student
      </Link>

      {students.length === 0 ? (
        <p>No students found. Add a new student to get started!</p>
      ) : (
        <div className="students-grid">
          {students.map((student) => (
            <div key={student.id} className="student-card">
              <img
                src={student.imageUrl}
                alt={`${student.firstName} ${student.lastName}`}
              />
              <h2>
                {student.firstName} {student.lastName}
              </h2>
              <p>Email: {student.email}</p>
              <p>GPA: {student.gpa}</p>
              {student.campus && (
                <p>
                  Campus:{" "}
                  <Link to={`/campuses/${student.campus.id}`}>
                    {student.campus.name}
                  </Link>
                </p>
              )}
              <div className="student-actions">
                <Link to={`/students/${student.id}`}>View Details</Link>
                <Link to={`/students/${student.id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(student.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllStudents;
