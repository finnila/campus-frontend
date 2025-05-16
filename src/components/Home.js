import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <h1>Welcome to the Campus Management System</h1>
      <div className="navigation-links">
        <Link to="/campuses" className="nav-link">
          <h2>View All Campuses</h2>
          <p>Browse through all campuses in our system</p>
        </Link>
        <Link to="/students" className="nav-link">
          <h2>View All Students</h2>
          <p>Browse through all students in our system</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
