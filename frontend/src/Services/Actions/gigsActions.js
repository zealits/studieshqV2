import {
  FETCH_GIGS_REQUEST,
  FETCH_GIGS_SUCCESS,
  FETCH_GIGS_FAIL,
  APPLY_GIG_REQUEST,
  APPLY_GIG_SUCCESS,
  APPLY_GIG_FAIL,
  ADD_GIG_REQUEST,
  ADD_GIG_SUCCESS,
  ADD_GIG_FAIL,
  CLEAR_ERRORS,
  FETCH_JOBS_REQUEST,
  FETCH_JOBS_SUCCESS,
  FETCH_JOBS_FAIL,
} from "../Constants/gigsConstants";
import axios from "axios";

// Add Gig
export const addGig = (gigData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_GIG_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    // Ensure selectedJobs is included in the gigData
    const { data } = await axios.post("/aak/l1/admin/gig", gigData, config);

    dispatch({ type: ADD_GIG_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ADD_GIG_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

// Fetch Gigs
export const fetchGigs = () => async (dispatch) => {
  try {
    dispatch({ type: FETCH_GIGS_REQUEST });

    const { data } = await axios.get("/aak/l1/gigs");

    dispatch({ type: FETCH_GIGS_SUCCESS, payload: data.gigs });
  } catch (error) {
    dispatch({ type: FETCH_GIGS_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

// Apply Gig
export const applyGig = (gigId) => async (dispatch) => {
  try {
    dispatch({ type: APPLY_GIG_REQUEST });

    const { data } = await axios.post("/aak/l1/gig/apply", { gigId });

    dispatch({ type: APPLY_GIG_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({ type: APPLY_GIG_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

// Fetch Jobs by Location
export const fetchJobsByLocation = (location) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_JOBS_REQUEST });

    const { data } = await axios.get(`/aak/l1/jobs/filter?country=${location}`);

    dispatch({ type: FETCH_JOBS_SUCCESS, payload: data.jobs });
  } catch (error) {
    dispatch({ type: FETCH_JOBS_FAIL, payload: error.response ? error.response.data.message : error.message });
  }
};
