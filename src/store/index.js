import { configureStore } from "@reduxjs/toolkit";
import campusesReducer from "./campusesSlice";
import studentsReducer from "./studentsSlice";

const store = configureStore({
  reducer: {
    campuses: campusesReducer,
    students: studentsReducer,
  },
});

export default store;
