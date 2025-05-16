import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleStudent, updateStudent } from "../store/studentsSlice";
import { fetchCampuses } from "../store/campusesSlice";

function EditStudent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    singleStudent: student,
    status,
    error,
  } = useSelector((state) => state.students);
  const { items: campuses } = useSelector((state) => state.campuses);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    imageUrl: "",
    gpa: "",
    campusId: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSingleStudent(id));
    dispatch(fetchCampuses());
  }, [dispatch, id]);

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        imageUrl: student.imageUrl || "",
        gpa: student.gpa || "",
        campusId: student.campusId || "",
      });
    }
  }, [student]);

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
    if (
      formData.gpa &&
      (isNaN(formData.gpa) || formData.gpa < 0 || formData.gpa > 4.0)
    ) {
      newErrors.gpa = "GPA must be between 0 and 4.0";
    }
    if (formData.imageUrl && !formData.imageUrl.startsWith("http")) {
      newErrors.imageUrl = "Image URL must start with http";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await dispatch(updateStudent({ id, student: formData }));
        navigate(`/students/${id}`);
      } catch (error) {
        setErrors({ submit: "Failed to update student. Please try again." });
      }
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
    <div className="edit-student">
      <h1>Edit Student</h1>
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
          <label htmlFor="gpa">GPA:</label>
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
          />
          {errors.gpa && <span className="error-message">{errors.gpa}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="campusId">Campus:</label>
          <select
            id="campusId"
            name="campusId"
            value={formData.campusId}
            onChange={handleChange}
          >
            <option value="">Select a campus</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
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
          <button type="submit">Update Student</button>
          <button type="button" onClick={() => navigate(`/students/${id}`)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;
