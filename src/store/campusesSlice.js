import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3003/api";

export const fetchCampuses = createAsyncThunk(
  "campuses/fetchCampuses",
  async () => {
    const response = await axios.get(`${API_URL}/campuses`);
    return response.data;
  }
);

export const fetchSingleCampus = createAsyncThunk(
  "campuses/fetchSingleCampus",
  async (id) => {
    const response = await axios.get(`${API_URL}/campuses/${id}`);
    return response.data;
  }
);

export const addCampus = createAsyncThunk(
  "campuses/addCampus",
  async (campus) => {
    const response = await axios.post(`${API_URL}/campuses`, campus);
    return response.data;
  }
);

export const updateCampus = createAsyncThunk(
  "campuses/updateCampus",
  async ({ id, campus }) => {
    const response = await axios.put(`${API_URL}/campuses/${id}`, campus);
    return response.data;
  }
);

export const deleteCampus = createAsyncThunk(
  "campuses/deleteCampus",
  async (id) => {
    await axios.delete(`${API_URL}/campuses/${id}`);
    return id;
  }
);

const campusesSlice = createSlice({
  name: "campuses",
  initialState: {
    items: [],
    singleCampus: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampuses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCampuses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCampuses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSingleCampus.fulfilled, (state, action) => {
        state.singleCampus = action.payload;
      })
      .addCase(addCampus.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCampus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (campus) => campus.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.singleCampus && state.singleCampus.id === action.payload.id) {
          state.singleCampus = action.payload;
        }
      })
      .addCase(deleteCampus.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (campus) => campus.id !== action.payload
        );
        if (state.singleCampus && state.singleCampus.id === action.payload) {
          state.singleCampus = null;
        }
      });
  },
});

export default campusesSlice.reducer;
