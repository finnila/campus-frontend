import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addStudent, fetchStudents } from "../store/studentsSlice";
import { fetchCampuses, addCampus } from "../store/campusesSlice";

function AddStudent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: campuses } = useSelector((state) => state.campuses);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    imageUrl: "https://via.placeholder.com/150",
    gpa: "",
    campusId: "",
    newCampus: {
      name: "",
      address: "",
      description: "",
      imageUrl: "https://via.placeholder.com/150",
    },
  });
  const [campusOption, setCampusOption] = useState("existing"); // "existing" or "new"
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Fetching campuses...");
    dispatch(fetchCampuses());
  }, [dispatch]);

  useEffect(() => {
    console.log("Current campuses:", campuses);
  }, [campuses]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.gpa) {
      newErrors.gpa = "GPA is required";
    } else if (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4.0) {
      newErrors.gpa = "GPA must be between 0 and 4.0";
    }

    if (campusOption === "existing") {
      if (!formData.campusId) {
        newErrors.campusId = "Campus is required";
      }
    } else {
      if (!formData.newCampus.name.trim()) {
        newErrors.newCampusName = "Campus name is required";
      }
      if (!formData.newCampus.address.trim()) {
        newErrors.newCampusAddress = "Campus address is required";
      }
    }

    if (formData.imageUrl && !formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "Image URL must start with http";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("newCampus.")) {
      const campusField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        newCampus: {
          ...prev.newCampus,
          [campusField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let campusId = formData.campusId;

        // If creating a new campus
        if (campusOption === "new") {
          const newCampus = await dispatch(
            addCampus(formData.newCampus)
          ).unwrap();
          campusId = newCampus.id;
        }

        // Create student with the campus ID
        await dispatch(
          addStudent({
            ...formData,
            campusId,
          })
        );

        await dispatch(fetchStudents());
        navigate("/students");
      } catch (error) {
        setErrors({ submit: "Failed to add student. Please try again." });
      }
    }
  };

  return (
    <div className="add-student">
      <h1>Add New Student</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? "error" : ""}
          />
          {errors.firstName && (
            <span className="error-message">{errors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? "error" : ""}
          />
          {errors.lastName && (
            <span className="error-message">{errors.lastName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gpa">
            GPA: <span className="required">*</span>
          </label>
          <input
            type="number"
            id="gpa"
            name="gpa"
            step="0.01"
            min="0"
            max="4.0"
            value={formData.gpa}
            onChange={handleChange}
            className={errors.gpa ? "error" : ""}
            required
          />
          {errors.gpa && <span className="error-message">{errors.gpa}</span>}
        </div>

        <div className="form-group">
          <label>
            Campus: <span className="required">*</span>
          </label>
          <div className="campus-options">
            <label>
              <input
                type="radio"
                name="campusOption"
                value="existing"
                checked={campusOption === "existing"}
                onChange={(e) => setCampusOption(e.target.value)}
              />
              Select Existing Campus
            </label>
            <label>
              <input
                type="radio"
                name="campusOption"
                value="new"
                checked={campusOption === "new"}
                onChange={(e) => setCampusOption(e.target.value)}
              />
              Create New Campus
            </label>
          </div>

          {campusOption === "existing" ? (
            <select
              id="campusId"
              name="campusId"
              value={formData.campusId}
              onChange={handleChange}
              className={errors.campusId ? "error" : ""}
              required
            >
              <option value="">Select a campus</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="new-campus-fields">
              <div className="form-group">
                <label htmlFor="newCampus.name">
                  Campus Name: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="newCampus.name"
                  name="newCampus.name"
                  value={formData.newCampus.name}
                  onChange={handleChange}
                  className={errors.newCampusName ? "error" : ""}
                  required
                />
                {errors.newCampusName && (
                  <span className="error-message">{errors.newCampusName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newCampus.address">
                  Campus Address: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="newCampus.address"
                  name="newCampus.address"
                  value={formData.newCampus.address}
                  onChange={handleChange}
                  className={errors.newCampusAddress ? "error" : ""}
                  required
                />
                {errors.newCampusAddress && (
                  <span className="error-message">
                    {errors.newCampusAddress}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newCampus.description">Description:</label>
                <textarea
                  id="newCampus.description"
                  name="newCampus.description"
                  value={formData.newCampus.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newCampus.imageUrl">Campus Image URL:</label>
                <input
                  type="text"
                  id="newCampus.imageUrl"
                  name="newCampus.imageUrl"
                  value={formData.newCampus.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {errors.campusId && (
            <span className="error-message">{errors.campusId}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className={errors.imageUrl ? "error" : ""}
          />
          {errors.imageUrl && (
            <span className="error-message">{errors.imageUrl}</span>
          )}
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-actions">
          <button type="submit">Add Student</button>
          <button type="button" onClick={() => navigate("/students")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;
