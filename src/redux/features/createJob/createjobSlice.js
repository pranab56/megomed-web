import { createSlice } from "@reduxjs/toolkit";

const createJobSlice = createSlice({
  name: "createJob",
  initialState: {
    jobTitle: "",
    jobType: "",
    jobLink: "",
    startDate: null,
    endDate: null,
    jobDescription: "",
    mustHaveQualifications: "",
    preferredQualifications: "",
    resetTrigger: 0,
  },
  reducers: {
    setJobTitle: (state, action) => {
      state.jobTitle = action.payload;
    },
    setJobType: (state, action) => {
      state.jobType = action.payload;
    },
    setJobLink: (state, action) => {
      state.jobLink = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setJobDescription: (state, action) => {
      state.jobDescription = action.payload;
    },
    setMustHaveQualifications: (state, action) => {
      state.mustHaveQualifications = action.payload;
    },
    setPreferredQualifications: (state, action) => {
      state.preferredQualifications = action.payload;
    },

    resetJobData: (state) => {
      state.jobTitle = "";
      state.jobType = "";
      state.jobLink = "";
      state.startDate = null;
      state.endDate = null;
      state.jobDescription = "";
      state.mustHaveQualifications = "";
      state.preferredQualifications = "";
      state.resetTrigger += 1;
    },

    consoleJobData: (state) => {
      console.log("Job Data:", {
        jobTitle: state.jobTitle,
        jobType: state.jobType,
        jobLink: state.jobLink,
        startDate: state.startDate,
        endDate: state.endDate,
        jobDescription: state.jobDescription,
        mustHaveQualifications: state.mustHaveQualifications,
        preferredQualifications: state.preferredQualifications,
      });
    },
  },
});

export const {
  setJobTitle,
  setJobType,
  setJobLink,
  setStartDate,
  setEndDate,
  setJobDescription,
  setMustHaveQualifications,
  setPreferredQualifications,
  resetJobData,
  consoleJobData,
} = createJobSlice.actions;

export default createJobSlice.reducer;
