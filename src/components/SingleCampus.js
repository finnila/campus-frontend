import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchSingleCampus, deleteCampus } from "../store/campusesSlice";
import CampusEnrollment from "./CampusEnrollment";

function SingleCampus() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    singleCampus: campus,
    status,
    error,
  } = useSelector((state) => state.campuses);

  useEffect(() => {
    dispatch(fetchSingleCampus(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this campus?")) {
      await dispatch(deleteCampus(id));
      navigate("/campuses");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!campus) {
    return <div>Campus not found</div>;
  }

  return (
    <div className="single-campus">
      <div className="campus-header">
        <h1>{campus.name}</h1>
        <div className="campus-actions">
          <Link to={`/campuses/${id}/edit`} className="edit-button">
            Edit Campus
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Delete Campus
          </button>
        </div>
      </div>

      <div className="campus-details">
        <img src={campus.imageUrl} alt={campus.name} />
        <div className="campus-info">
          <p>
            <strong>Address:</strong> {campus.address}
          </p>
          <p>
            <strong>Description:</strong> {campus.description}
          </p>
        </div>
      </div>

      <div className="enrolled-students">
        <h2>Enrolled Students</h2>
        {campus.students && campus.students.length > 0 ? (
          <div className="students-grid">
            {campus.students.map((student) => (
              <div key={student.id} className="student-card">
                <img
                  src={student.imageUrl}
                  alt={`${student.firstName} ${student.lastName}`}
                />
                <h3>
                  {student.firstName} {student.lastName}
                </h3>
                <p>Email: {student.email}</p>
                <p>GPA: {student.gpa}</p>
                <Link to={`/students/${student.id}`}>View Details</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No students are currently enrolled at this campus.</p>
        )}
      </div>

      <CampusEnrollment campusId={campus.id} />
    </div>
  );
}

export default SingleCampus;
