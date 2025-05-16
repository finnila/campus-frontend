import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";

// Import components (we'll create these next)
import Home from "./components/Home";
import AllCampuses from "./components/AllCampuses";
import SingleCampus from "./components/SingleCampus";
import AddCampus from "./components/AddCampus";
import EditCampus from "./components/EditCampus";
import AllStudents from "./components/AllStudents";
import SingleStudent from "./components/SingleStudent";
import AddStudent from "./components/AddStudent";
import EditStudent from "./components/EditStudent";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <nav>
            <Link to="/">Home</Link>
            <Link to="/campuses">Campuses</Link>
            <Link to="/students">Students</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/campuses" element={<AllCampuses />} />
            <Route path="/campuses/:id" element={<SingleCampus />} />
            <Route path="/campuses/add" element={<AddCampus />} />
            <Route path="/campuses/:id/edit" element={<EditCampus />} />
            <Route path="/students" element={<AllStudents />} />
            <Route path="/students/:id" element={<SingleStudent />} />
            <Route path="/students/add" element={<AddStudent />} />
            <Route path="/students/:id/edit" element={<EditStudent />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
