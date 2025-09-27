import { createSlice } from "@reduxjs/toolkit";

const createTenderSlice = createSlice({
  name: "createTender",
  initialState: {
    projectTitle: "",
    startDate: null,
    endDate: null,
    tenderDescription: "",
    mustHaveQualifications: "",
    preferredQualifications: "",
    resetTrigger: 0,
  },
  reducers: {
    setProjectTitle: (state, action) => {
      state.projectTitle = action.payload;
    },

    setStartDate: (state, action) => {
      // Ensure we only store null or ISO date strings
      if (action.payload === null || typeof action.payload === "string") {
        state.startDate = action.payload;
      } else {
        console.warn("Invalid startDate value:", action.payload);
        state.startDate = null;
      }
    },
    setEndDate: (state, action) => {
      // Ensure we only store null or ISO date strings
      if (action.payload === null || typeof action.payload === "string") {
        state.endDate = action.payload;
      } else {
        console.warn("Invalid endDate value:", action.payload);
        state.endDate = null;
      }
    },
    setTenderDescription: (state, action) => {
      state.tenderDescription = action.payload;
    },
    setMustHaveQualifications: (state, action) => {
      state.mustHaveQualifications = action.payload;
    },
    setPreferredQualifications: (state, action) => {
      state.preferredQualifications = action.payload;
    },

    resetTenderData: (state) => {
      state.projectTitle = "";
      state.startDate = null;
      state.endDate = null;
      state.tenderDescription = "";
      state.mustHaveQualifications = "";
      state.preferredQualifications = "";
      state.resetTrigger += 1;
    },

    consoleTenderData: (state) => {
      console.log("Tender Data:", {
        projectTitle: state.projectTitle,
        startDate: state.startDate,
        endDate: state.endDate,
        tenderDescription: state.tenderDescription,
        mustHaveQualifications: state.mustHaveQualifications,
        preferredQualifications: state.preferredQualifications,
      });
    },
  },
});

export const {
  setProjectTitle,
  setStartDate,
  setEndDate,
  setTenderDescription,
  setMustHaveQualifications,
  setPreferredQualifications,
  resetTenderData,
  consoleTenderData,
} = createTenderSlice.actions;

export default createTenderSlice.reducer;
