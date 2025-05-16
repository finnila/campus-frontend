import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchSingleStudent, deleteStudent } from "../store/studentsSlice";

function SingleStudent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    singleStudent: student,
    status,
    error,
  } = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchSingleStudent(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await dispatch(deleteStudent(id));
      navigate("/students");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="single-student">
      <div className="student-header">
        <h1>
          {student.firstName} {student.lastName}
        </h1>
        <div className="student-actions">
          <Link to={`/students/${id}/edit`} className="edit-button">
            Edit Student
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Delete Student
          </button>
        </div>
      </div>

      <div className="student-details">
        <img
          src={student.imageUrl}
          alt={`${student.firstName} ${student.lastName}`}
        />
        <div className="student-info">
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>GPA:</strong> {student.gpa}
          </p>
          {student.campus ? (
            <p>
              <strong>Campus:</strong>{" "}
              <Link to={`/campuses/${student.campus.id}`}>
                {student.campus.name}
              </Link>
            </p>
          ) : (
            <p>Not enrolled in any campus</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SingleStudent;
