import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCampuses, deleteCampus } from "../store/campusesSlice";

function AllCampuses() {
  const dispatch = useDispatch();
  const {
    items: campuses,
    status,
    error,
  } = useSelector((state) => state.campuses);

  useEffect(() => {
    console.log("AllCampuses component mounted");
    console.log("Current status:", status);

    if (status === "idle") {
      console.log("Dispatching fetchCampuses action");
      dispatch(fetchCampuses())
        .then(() => console.log("Fetch campuses completed"))
        .catch((err) => console.error("Error fetching campuses:", err));
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this campus?")) {
      dispatch(deleteCampus(id));
    }
  };

  console.log(
    "Rendering AllCampuses. Status:",
    status,
    "Error:",
    error,
    "Campuses:",
    campuses
  );

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="all-campuses">
      <h1>All Campuses</h1>
      <Link to="/campuses/add" className="add-button">
        Add New Campus
      </Link>

      {campuses.length === 0 ? (
        <p>No campuses found. Add a new campus to get started!</p>
      ) : (
        <div className="campuses-grid">
          {campuses.map((campus) => (
            <div key={campus.id} className="campus-card">
              <img src={campus.imageUrl} alt={campus.name} />
              <h2>{campus.name}</h2>
              <p>{campus.address}</p>
              <div className="campus-actions">
                <Link to={`/campuses/${campus.id}`}>View Details</Link>
                <Link to={`/campuses/${campus.id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(campus.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllCampuses;
