import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3003/api";

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  }
);

export const fetchSingleStudent = createAsyncThunk(
  "students/fetchSingleStudent",
  async (id) => {
    const response = await axios.get(`${API_URL}/students/${id}`);
    return response.data;
  }
);

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (student) => {
    const response = await axios.post(`${API_URL}/students`, student);
    return response.data;
  }
);

export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, student }) => {
    const response = await axios.put(`${API_URL}/students/${id}`, student);
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id) => {
    await axios.delete(`${API_URL}/students/${id}`);
    return id;
  }
);

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    items: [],
    singleStudent: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSingleStudent.fulfilled, (state, action) => {
        state.singleStudent = action.payload;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (student) => student.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (
          state.singleStudent &&
          state.singleStudent.id === action.payload.id
        ) {
          state.singleStudent = action.payload;
        }
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (student) => student.id !== action.payload
        );
        if (state.singleStudent && state.singleStudent.id === action.payload) {
          state.singleStudent = null;
        }
      });
  },
});

export default studentsSlice.reducer;
